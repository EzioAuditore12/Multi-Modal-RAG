import { ReactNode } from 'react';
import {
  ChatEvent,
  ChatEventAddon,
  ChatEventBody,
  ChatEventContent,
  ChatEventTime,
} from '@/components/chat/chat-event';

export function AdditionalMessage({
  content,
  timestamp,
}: {
  content: ReactNode;
  timestamp: number;
}) {
  return (
    <ChatEvent className="hover:bg-accent group">
      <ChatEventAddon>
        <ChatEventTime
          timestamp={timestamp}
          format="time"
          className="invisible text-right text-[8px] group-hover:visible @md/chat:text-[10px]"
        />
      </ChatEventAddon>
      <ChatEventBody>
        <ChatEventContent>{content}</ChatEventContent>
      </ChatEventBody>
    </ChatEvent>
  );
}
