'use client';

import { useState, useMemo } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { useAuthenticatedServerSideEvents } from '@/lib/use-auth-sse';
import { env } from '@/env';
import { SnowFlakeId } from '@/lib/snowflake';
import { ChatMessage } from '@/features/chat/components/chat-message';
import { ChatInputForm } from '@/features/chat/components/chat-input-form';
import { CheckCircle2, Loader2 } from 'lucide-react';
// Import a hook to fetch messages: e.g., useGetChatMessages(chatId)

export default function ChattingScreen() {
  const { id: projectId, chatId } = useParams() as { id: string; chatId: string };
  const searchParams = useSearchParams();
  const router = useRouter();

  const [messages, setMessages] = useState<any[]>([]); // Initialize with fetched history
  const [streamingAiMessage, setStreamingAiMessage] = useState<string>('');
  const [thinkingSteps, setThinkingSteps] = useState<string[]>([]);
  const isFirstTime = !!searchParams.get('query');

  const [chatState, setChatState] = useState({
    query: searchParams.get('query') || '',
    messageId: new SnowFlakeId(1).generate().toString(),
  });

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
    enabled: !!chatState.query, // Only connect when there is a query
    options: sseOptions,
    events: {
      message: (data: any) => {
        let text = '';
        try {
          // SSE sends JSON serialized strings like "Starting..."
          text = typeof data === 'string' ? JSON.parse(data) : data;
        } catch {
          text = data;
        }
        setThinkingSteps((prev) => [...prev, text]);
      },
      message_chunk: (data: any) => {
        const parsed = typeof data === 'string' ? JSON.parse(data) : data;
        if (parsed?.text) {
          setStreamingAiMessage((prev) => prev + parsed.text);
        }
      },
      result: (data: any) => {
        const parsedData = typeof data === 'string' ? JSON.parse(data) : data;
        // Append AI response to messages state
        setMessages((prev) => [...prev, { role: 'ai', content: parsedData.content }]);

        // Clear streaming state and thinking steps
        setStreamingAiMessage('');
        setThinkingSteps([]);

        // Clear the URL query param so a refresh doesn't resend the first message
        if (isFirstTime && searchParams.get('query')) {
          router.replace(`/project/${projectId}/${chatId}`);
        }

        setChatState((prev) => ({ ...prev, query: '' })); // stop SSE fetching
      },
    },
  });

  const handleSendMessage = (text: string) => {
    // Append the user's message to the UI instantly
    setMessages((prev) => [...prev, { role: 'human', content: text }]);
    // Reset steps for upcoming new response
    setThinkingSteps([]);
    // Trigger SSE connection for the follow-up message
    setChatState({
      query: text,
      messageId: new SnowFlakeId(1).generate(),
    });
  };

  return (
    <div className="relative flex h-full flex-1 flex-col">
      <div className="flex-1 space-y-4 overflow-y-auto p-4 pb-32">
        <div className="mx-auto flex max-w-3xl flex-col gap-6">
          {/* Render fetched history + new messages here */}
          {messages.map((msg, i) => (
            <ChatMessage key={i} role={msg.role} content={msg.content} />
          ))}

          {/* Active Streaming Message */}
          {!!streamingAiMessage && <ChatMessage role="ai" content={streamingAiMessage} />}

          {/* Real-time process steps from backend logic */}
          {!!chatState.query && !streamingAiMessage && thinkingSteps.length > 0 && (
            <div className="bg-muted/20 ml-16 max-w-2xl rounded-xl border p-4 shadow-sm">
              <div className="text-muted-foreground mb-3 flex items-center gap-2 text-xs font-semibold">
                <Loader2 className="text-primary size-4 animate-spin" />
                <span>Processing Request...</span>
              </div>
              <ul className="border-muted ml-2 flex flex-col gap-2 border-l-2 pl-4">
                {thinkingSteps.map((step, idx) => (
                  <li
                    key={idx}
                    className="animate-in fade-in text-muted-foreground fill-mode-both flex items-center gap-2 text-xs delay-75 duration-500">
                    <CheckCircle2 className="size-3 text-green-500" />
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Input area fixed at the bottom for continuation */}
      <div className="bg-background/80 absolute bottom-0 w-full border-t p-4 backdrop-blur-md">
        <ChatInputForm onSend={handleSendMessage} isLoading={!!chatState.query} />
      </div>
    </div>
  );
}
