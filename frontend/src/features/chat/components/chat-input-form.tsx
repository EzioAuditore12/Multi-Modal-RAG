'use client';

import { SendIcon } from 'lucide-react';
import type { ComponentProps } from 'react';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useForm } from '@tanstack/react-form';

interface ChatInputFormProps extends ComponentProps<'form'> {
  onSend: (message: string) => void;
  isLoading?: boolean;
}

export function ChatInputForm({ onSend, isLoading, className, ...props }: ChatInputFormProps) {
  const {} = useForm();

  return (
    <form
      className={cn('mx-auto flex w-full max-w-3xl items-end gap-2', className)}
      onSubmit={(e) => {
        e.preventDefault();
        const form = e.currentTarget;
        const input = form.elements.namedItem('message') as HTMLInputElement;
        const value = input.value.trim();
        if (value && !isLoading) {
          onSend(value);
          input.value = '';
        }
      }}
      {...props}>
      <Input
        name="message"
        placeholder="Type a message..."
        className="flex-1 resize-none rounded-xl"
        disabled={isLoading}
        autoComplete="off"
      />
      <Button type="submit" disabled={isLoading} size="icon" className="shrink-0 rounded-xl">
        <SendIcon className="size-4" />
        <span className="sr-only">Send message</span>
      </Button>
    </form>
  );
}
