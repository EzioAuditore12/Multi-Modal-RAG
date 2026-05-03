'use client';

import { Activity, useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import type { StickToBottomContext } from 'use-stick-to-bottom';

import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
  type ConversationProps,
} from '@/components/ai/conversation';
import { cn } from '@/lib/utils';
import {
  Message,
  MessageBranch,
  MessageBranchContent,
  MessageContent,
  MessageResponse,
} from '@/components/ai/message';
import type { Message as ApiMessage } from '@/features/chat/schemas/message.schema';

import { StreamThinking } from './stream-thinking';

export type ConversationMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

export type ChatMessage = {
  id: string;
  role: 'human' | 'ai';
  content: string;
};

interface ConversationListProps extends Omit<
  ConversationProps,
  'conversationContextRef' | 'children'
> {
  data: ApiMessage[];
  messages: ChatMessage[];
  isStreaming: boolean;
  thinkingSteps: string[];
  streamingAiMessage: string;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
}

export function ConversationList({
  className,
  data,
  messages,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  isStreaming,
  thinkingSteps,
  streamingAiMessage,
  ...props
}: ConversationListProps) {
  const conversationContextRef = useRef<StickToBottomContext | null>(null);
  const scrollContainerRef = useRef<HTMLElement | null>(null);
  const pendingScrollAdjustmentRef = useRef<boolean>(false);
  const previousScrollHeightRef = useRef<number>(0);
  const previousScrollTopRef = useRef<number>(0);

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
  }, [data.length]);

  const allHistory = useMemo(() => {
    const fromApi = [...(data || [])];
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
    ] as ConversationMessage[];
  }, [data, messages]);

  return (
    <Conversation className={cn(className)} contextRef={conversationContextRef} {...props}>
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
  );
}
