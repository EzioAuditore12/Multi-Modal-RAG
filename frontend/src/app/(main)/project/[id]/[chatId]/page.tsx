'use client';

import { useState, useMemo } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

import { useAuthenticatedServerSideEvents } from '@/lib/use-auth-sse';
import { env } from '@/env';
import { SnowFlakeId } from '@/lib/snowflake';

import { useGetChatMessages } from '@/features/chat/hooks/use-get-chat-messages';

import type { PromptInputMessage } from '@/components/ai/prompt-input';

import { ChatPromptInput } from '@/features/chat/components/input';
import { ChatResultEvent } from '@/features/chat/schemas/events/result.schema';
import { MessageChunkEvent } from '@/features/chat/schemas/events/message-chunk.event';
import { ConversationList } from '@/features/chat/components/conversation-list';

// Message types
type ChatMessage = {
  id: string;
  role: 'human' | 'ai';
  content: string;
};

export default function ChattingScreen() {
  const { id: projectId, chatId } = useParams() as { id: string; chatId: string };
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [streamingAiMessage, setStreamingAiMessage] = useState<string>('');
  const [thinkingSteps, setThinkingSteps] = useState<string[]>([]);
  const isFirstTime = !!searchParams.get('query');

  const [chatState, setChatState] = useState({
    query: searchParams.get('query') || '',
    messageId: new SnowFlakeId(1).generate().toString(),
  });

  const [text, setText] = useState<string>('');

  const sseOptions = useMemo(
    () => ({
      query: {
        chatId,
        messageId: chatState.messageId,
        projectId,
        query: chatState.query,
        isFirstTime: isFirstTime && !!searchParams.get('query') ? 'true' : 'false',
      },
    }),
    [chatId, chatState.messageId, projectId, chatState.query, isFirstTime, searchParams]
  );

  useAuthenticatedServerSideEvents({
    url: `${env.NEXT_PUBLIC_API_URL}/chat/new`,
    enabled: !!chatState.query,
    options: sseOptions,
    events: {
      message: (data: string) => {
        let text = '';
        try {
          text = typeof data === 'string' ? JSON.parse(data) : data;
        } catch {
          text = data;
        }
        setThinkingSteps((prev) => [...prev, text]);
      },
      message_chunk: (data) => {
        queryClient.invalidateQueries({ queryKey: ['search-chats'] });

        const parsed: MessageChunkEvent = typeof data === 'string' ? JSON.parse(data) : data;
        if (parsed?.text) {
          setStreamingAiMessage((prev) => prev + parsed.text);
        }
      },
      result: (data) => {
        const parsedData: ChatResultEvent = typeof data === 'string' ? JSON.parse(data) : data;
        setMessages((prev) => [
          ...prev,
          { role: 'ai', content: parsedData.content, id: parsedData.id },
        ]);
        setStreamingAiMessage('');
        setThinkingSteps([]);

        if (isFirstTime && searchParams.get('query')) {
          router.replace(`/project/${projectId}/${chatId}`);
        }
        setChatState((prev) => ({ ...prev, query: '' }));
      },
    },
  });

  const handleSendMessage = (message: PromptInputMessage) => {
    const hasText = Boolean(message.text);
    const hasAttachments = Boolean(message.files?.length);
    if (!(hasText || hasAttachments)) return;

    if (message.files?.length) {
      toast.success('Files attached', {
        description: `${message.files.length} file(s) attached to message`,
      });
    }

    const newQuery = message.text || 'Sent with attachments';
    setMessages((prev) => [...prev, { role: 'human', content: newQuery, id: chatState.messageId }]);
    setThinkingSteps([]);
    setText('');

    setChatState({
      query: newQuery,
      messageId: new SnowFlakeId(1).generate().toString(),
    });
  };

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useGetChatMessages({
    chatId,
    pageSize: 10,
  });

  const flattenedData = data?.pages.flatMap((page) => page).reverse() || [];

  const isStreaming = !!chatState.query;

  return (
    <div className="absolute inset-0 flex h-full w-full flex-col overflow-hidden">
      <ConversationList
        className="min-h-0 flex-1 border-b"
        data={flattenedData}
        messages={messages}
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        isStreaming={isStreaming}
        streamingAiMessage={streamingAiMessage}
        thinkingSteps={thinkingSteps}
      />

      <div className="mx-auto w-full max-w-4xl shrink-0 space-y-4 px-4 pt-4 pb-6">
        <ChatPromptInput
          isStreaming={isStreaming}
          onSubmit={handleSendMessage}
          text={text}
          onTextChange={setText}
        />
      </div>
    </div>
  );
}
