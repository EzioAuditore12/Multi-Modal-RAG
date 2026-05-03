import { Activity } from 'react';

import {
  Message,
  MessageBranch,
  MessageBranchContent,
  MessageContent,
  MessageResponse,
  type MessageBranchProps,
} from '@/components/ai/message';
import { Reasoning, ReasoningContent, ReasoningTrigger } from '@/components/ai/reasoning';

import { cn } from '@/lib/utils';

export interface StreamThinkingProps extends MessageBranchProps {
  thinkingSteps: string[];
  streamingAiMessage: string;
}

export function StreamThinking({
  className,
  thinkingSteps,
  streamingAiMessage,
  defaultBranch = 0,
  ...props
}: StreamThinkingProps) {
  return (
    <MessageBranch
      className={cn(className)}
      defaultBranch={defaultBranch}
      key="streaming-msg"
      {...props}>
      <MessageBranchContent>
        <Message from="assistant">
          <div>
            <Activity mode={thinkingSteps.length > 0 && !streamingAiMessage ? 'visible' : 'hidden'}>
              <Reasoning duration={0} defaultOpen={true}>
                <ReasoningTrigger />
                <ReasoningContent>{thinkingSteps.join('\n')}</ReasoningContent>
              </Reasoning>
            </Activity>
            <Activity mode={streamingAiMessage ? 'visible' : 'hidden'}>
              <MessageContent>
                <MessageResponse>{streamingAiMessage}</MessageResponse>
              </MessageContent>
            </Activity>
          </div>
        </Message>
      </MessageBranchContent>
    </MessageBranch>
  );
}
