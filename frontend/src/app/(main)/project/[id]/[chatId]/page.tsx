'use client';

import { useState, useMemo, useLayoutEffect, useEffect, useRef, Activity } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import type { StickToBottomContext } from 'use-stick-to-bottom';

import { useAuthenticatedServerSideEvents } from '@/lib/use-auth-sse';
import { env } from '@/env';
import { SnowFlakeId } from '@/lib/snowflake';

import { useGetChatMessages } from '@/features/chat/hooks/use-get-chat-messages';

import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from '@/components/ai/conversation';
import {
  Message,
  MessageBranch,
  MessageBranchContent,
  MessageContent,
  MessageResponse,
} from '@/components/ai/message';

import { type PromptInputMessage } from '@/components/ai/prompt-input';

import { ChatPromptInput } from '@/features/chat/components/input';
import { StreamThinking } from '@/features/chat/components/stream-thinking';
import { ChatResultEvent } from '@/features/chat/schemas/events/result.schema';
import { MessageChunkEvent } from '@/features/chat/schemas/events/message-chunk.event';

// Message types
type ChatMessage = {
  id: string;
  role: 'human' | 'ai';
  content: string;
};

type ChatMessageForDisplay = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

export default function ChattingScreen() {
  const { id: projectId, chatId } = useParams() as { id: string; chatId: string };
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const conversationContextRef = useRef<StickToBottomContext | null>(null);
  const scrollContainerRef = useRef<HTMLElement | null>(null);
  const pendingScrollAdjustmentRef = useRef(false);
  const previousScrollHeightRef = useRef(0);
  const previousScrollTopRef = useRef(0);

  const [messages, setMessages] = useState<ChatMessage[]>([]); // Initialize with fetched history
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

  // Combine all messages to format for UI component
  const allHistory = useMemo(() => {
    const fromApi = [...(data?.pages.flatMap((page) => page) || [])].reverse();
    return [
      ...fromApi.map((msg) => ({
        id: msg.id,
        role: msg.type === 'human' ? 'user' : 'assistant',
        content: msg.content,
      })),
      ...messages.map((msg) => ({
        id: msg.id,
        role: msg.role === 'human' ? 'user' : 'assistant',
        content: msg.content,
      })),
    ] as ChatMessageForDisplay[];
  }, [data, messages]);

  const isStreaming = !!chatState.query;

  useEffect(() => {
    const container = conversationContextRef.current?.scrollRef.current;
    if (!container) return;

    scrollContainerRef.current = container;

    const handleScroll = () => {
      if (container.scrollTop > 80 || !hasNextPage || isFetchingNextPage) return;

      pendingScrollAdjustmentRef.current = true;
      previousScrollHeightRef.current = container.scrollHeight;
      previousScrollTopRef.current = container.scrollTop;

      void fetchNextPage();
    };

    container.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  useLayoutEffect(() => {
    if (!pendingScrollAdjustmentRef.current) return;

    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollHeightDelta = container.scrollHeight - previousScrollHeightRef.current;
    container.scrollTop = previousScrollTopRef.current + scrollHeightDelta;
    pendingScrollAdjustmentRef.current = false;
  }, [data?.pages.length]);

  return (
    <div className="absolute inset-0 flex h-full w-full flex-col overflow-hidden">
      <Conversation contextRef={conversationContextRef} className="min-h-0 flex-1 border-b">
        <ConversationContent>
          {allHistory.map((message, i) => (
            <MessageBranch defaultBranch={0} key={message.id || i}>
              <MessageBranchContent>
                <Message from={message.role === 'user' ? 'user' : 'assistant'}>
                  <div>
                    <MessageContent>
                      <MessageResponse>{message.content}</MessageResponse>
                    </MessageContent>
                  </div>
                </Message>
              </MessageBranchContent>
            </MessageBranch>
          ))}

          <Activity mode={isStreaming ? 'visible' : 'hidden'}>
            <StreamThinking streamingAiMessage={streamingAiMessage} thinkingSteps={thinkingSteps} />
          </Activity>
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

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
