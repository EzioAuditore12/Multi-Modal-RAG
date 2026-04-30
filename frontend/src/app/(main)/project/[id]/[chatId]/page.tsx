'use client';

import { useState, useMemo, Activity } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { useAuthenticatedServerSideEvents } from '@/lib/use-auth-sse';
import { env } from '@/env';
import { SnowFlakeId } from '@/lib/snowflake';

import { useQueryClient } from '@tanstack/react-query';
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
import { Reasoning, ReasoningContent, ReasoningTrigger } from '@/components/ai/reasoning';

import { type PromptInputMessage } from '@/components/ai/prompt-input';

import { ChatPromptInput } from '@/features/chat/components/input';

export default function ChattingScreen() {
  const { id: projectId, chatId } = useParams() as { id: string; chatId: string };
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [messages, setMessages] = useState<any[]>([]); // Initialize with fetched history
  const [streamingAiMessage, setStreamingAiMessage] = useState<string>('');
  const [thinkingSteps, setThinkingSteps] = useState<string[]>([]);
  const isFirstTime = !!searchParams.get('query');

  const [chatState, setChatState] = useState({
    query: searchParams.get('query') || '',
    messageId: new SnowFlakeId(1).generate().toString(),
  });

  const [text, setText] = useState<string>('');
  const [useWebSearch, setUseWebSearch] = useState<boolean>(false);
  const [useMicrophone, setUseMicrophone] = useState<boolean>(false);

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

  const { getEventData } = useAuthenticatedServerSideEvents({
    url: `${env.NEXT_PUBLIC_API_URL}/chat/new`,
    enabled: !!chatState.query,
    options: sseOptions,
    events: {
      message: (data: any) => {
        let text = '';
        try {
          text = typeof data === 'string' ? JSON.parse(data) : data;
        } catch {
          text = data;
        }
        setThinkingSteps((prev) => [...prev, text]);
      },
      message_chunk: (data: any) => {
        queryClient.invalidateQueries({ queryKey: ['search-chats'] });

        const parsed = typeof data === 'string' ? JSON.parse(data) : data;
        if (parsed?.text) {
          setStreamingAiMessage((prev) => prev + parsed.text);
        }
      },
      result: (data: any) => {
        const parsedData = typeof data === 'string' ? JSON.parse(data) : data;
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

  const { data } = useGetChatMessages({ chatId, pageSize: 10 });

  // Combine all messages to format for UI component
  const allHistory = useMemo(() => {
    const fromApi = data?.pages.flatMap((page) => page) || [];
    return [
      ...fromApi.map((msg: any) => ({
        id: msg.id,
        role: msg.type === 'human' ? 'user' : 'assistant',
        content: msg.content,
      })),
      ...messages.map((msg) => ({
        id: msg.id,
        role: msg.role === 'human' ? 'user' : 'assistant',
        content: msg.content,
      })),
    ];
  }, [data, messages]);

  const isStreaming = !!chatState.query;

  return (
    <div className="absolute inset-0 flex h-full w-full flex-col overflow-hidden">
      <Conversation className="min-h-0 flex-1 border-b">
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
            <MessageBranch defaultBranch={0} key="streaming-msg">
              <MessageBranchContent>
                <Message from="assistant">
                  <div>
                    {thinkingSteps.length > 0 && !streamingAiMessage && (
                      <Reasoning duration={0} defaultOpen={true}>
                        <ReasoningTrigger />
                        <ReasoningContent>{thinkingSteps.join('\n')}</ReasoningContent>
                      </Reasoning>
                    )}
                    {streamingAiMessage && (
                      <MessageContent>
                        <MessageResponse>{streamingAiMessage}</MessageResponse>
                      </MessageContent>
                    )}
                  </div>
                </Message>
              </MessageBranchContent>
            </MessageBranch>
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
