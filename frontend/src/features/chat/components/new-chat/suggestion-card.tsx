import { Network, Sparkles, type LucideIcon } from 'lucide-react';
import { ComponentProps } from 'react';

import { cn } from '@/lib/utils';

interface SuggestionCardProps extends Omit<ComponentProps<'button'>, 'onClick'> {
  title: string;
  Icon: LucideIcon;
  onClick: (t: string) => void;
}

function SuggestionCard({ title, Icon, onClick, ...props }: SuggestionCardProps) {
  return (
    <button
      onClick={() => onClick(title)}
      className={cn(
        'flex flex-col items-start justify-between rounded-2xl border border-slate-200 bg-white p-6 text-left transition-all hover:-translate-y-1 hover:shadow-md dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-900'
      )}
      {...props}>
      <Icon className="mb-4 h-5 w-5 text-slate-500 dark:text-slate-400" />
      <span className="font-medium text-slate-700 dark:text-slate-300">{title}</span>
    </button>
  );
}

interface SuggestionGridProps extends ComponentProps<'div'> {
  onSuggestionClick: (t: string) => void;
}

export function SuggestionGrid({ className, onSuggestionClick, ...props }: SuggestionGridProps) {
  return (
    <div className={cn('grid w-full max-w-3xl grid-cols-1 gap-4 md:grid-cols-2')} {...props}>
      <SuggestionCard
        className="w-full"
        title="What is future of attention-based models"
        Icon={Sparkles}
        onClick={onSuggestionClick}
      />
      <SuggestionCard
        title="Explain quantum entanglement"
        Icon={Network}
        onClick={onSuggestionClick}
      />
    </div>
  );
}
