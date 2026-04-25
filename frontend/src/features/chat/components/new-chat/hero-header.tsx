import type { ComponentProps } from 'react';

import { H1 } from '@/components/ui/typography';

import { cn } from '@/lib/utils';

export function NewChatHeroHeader({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div className={cn('text-center', className)} {...props}>
      <H1 className="tracking-tight text-slate-900 dark:text-slate-50">
        Hello, how can I help you today?
      </H1>
    </div>
  );
}
