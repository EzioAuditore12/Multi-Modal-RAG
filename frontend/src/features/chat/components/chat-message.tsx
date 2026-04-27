'use client';

import { Bot, User } from 'lucide-react';
import { cn } from '@/lib/utils'; // Assuming this exists based on shadcn usage

interface ChatMessageProps {
  role: 'human' | 'ai';
  content: string;
}

export function ChatMessage({ role, content }: ChatMessageProps) {
  const isHuman = role === 'human';

  return (
    <div
      className={cn(
        'flex w-full max-w-3xl items-start gap-4 rounded-lg p-4',
        isHuman ? 'bg-primary/10 ml-auto flex-row-reverse' : 'bg-muted/50'
      )}>
      <div
        className={cn(
          'flex size-8 shrink-0 items-center justify-center rounded-full border',
          isHuman ? 'bg-primary text-primary-foreground' : 'bg-background'
        )}>
        {isHuman ? <User className="size-5" /> : <Bot className="size-5" />}
      </div>
      <div className="flex flex-col gap-1 overflow-hidden">
        <span className={cn('text-sm font-semibold', isHuman ? 'text-right' : 'text-left')}>
          {isHuman ? 'You' : 'AI'}
        </span>
        <p
          className={cn(
            'prose dark:prose-invert text-sm leading-relaxed',
            isHuman ? 'text-right' : 'text-left'
          )}>
          {content}
        </p>
      </div>
    </div>
  );
}
