'use client';

import { MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

interface NewChatWelcomeProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUseSample: (t: string) => void;
  onSkip: () => void;
}

const SAMPLE_PROMPT =
  'Provide a ranked table of countries by GDP (nominal) for 2023 (World Bank). Include columns: Rank, Country, GDP (USD), and a brief 1-2 sentence explanation for why the country ranks where it does (factors like economic structure, resources, population). Show the top 50 and cite the data source.';

export function NewChatWelcome({ open, onOpenChange, onUseSample, onSkip }: NewChatWelcomeProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-teal-100 text-teal-600">
            <MessageSquare className="h-6 w-6" />
          </div>
          <DialogTitle className="text-center text-xl">Start a New Chat</DialogTitle>
          <DialogDescription className="text-center text-base">
            Need a quick example to get started? Use the sample prompt below to try the RAG
            workflow, or skip the tutorial if you prefer.
          </DialogDescription>
        </DialogHeader>

        <div className="bg-muted mt-4 rounded-md border border-slate-200 p-4 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-200">
          <strong className="mb-2 block">Sample prompt</strong>
          <pre className="text-sm break-words whitespace-pre-wrap">{SAMPLE_PROMPT}</pre>
        </div>

        <DialogFooter className="mt-4 flex-col gap-2 sm:flex-row sm:justify-center">
          <Button
            variant="outline"
            onClick={() => {
              onSkip();
              onOpenChange(false);
            }}
            className="w-full sm:w-auto">
            Skip
          </Button>
          <Button
            onClick={() => {
              onUseSample(SAMPLE_PROMPT);
              onOpenChange(false);
            }}
            className="w-full sm:w-auto">
            Use sample
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default NewChatWelcome;
