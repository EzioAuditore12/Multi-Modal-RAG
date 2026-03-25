import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { ChatEvent, ChatEventTime } from '@/components/chat/chat-event';

export function DateItem({ timestamp, className }: { timestamp: number; className?: string }) {
  return (
    <ChatEvent className={cn('items-center gap-1', className)}>
      <Separator className="flex-1" />
      <ChatEventTime timestamp={timestamp} format="longDate" className="min-w-max font-semibold" />
      <Separator className="flex-1" />
    </ChatEvent>
  );
}
