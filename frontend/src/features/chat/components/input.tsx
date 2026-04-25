'use client';

import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { useForm } from '@tanstack/react-form';
import { z } from 'zod';
import { useEffect, type ComponentProps } from 'react';
import { Mic, Square, Send } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface ChatInputAreaProps extends ComponentProps<'form'> {
  onResult: (t: string) => void;
  suggestedText: string;
}

export function ChatInputArea({
  className,
  onResult,
  suggestedText,
  ...props
}: ChatInputAreaProps) {
  const { transcript, listening, resetTranscript } = useSpeechRecognition();
  const { Field, setFieldValue, getFieldValue, handleSubmit } = useForm({
    defaultValues: {
      inputText: '',
    },
    validators: {
      onSubmit: z.object({
        inputText: z.string().max(512),
      }),
    },
    onSubmit: async ({ value }) => {
      onResult(value.inputText);
    },
  });

  useEffect(() => {
    if (suggestedText) setFieldValue('inputText', suggestedText);
  }, [suggestedText]);

  useEffect(() => {
    if (transcript) setFieldValue('inputText', transcript);
  }, [transcript]);

  const handleStart = () => {
    resetTranscript();
    setFieldValue('inputText', '');
    SpeechRecognition.startListening({ continuous: false });
  };

  const handleStop = () => {
    SpeechRecognition.stopListening();
    onResult(getFieldValue('inputText') || transcript);
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
      className={cn(
        'flex items-center gap-2 rounded-full border border-white bg-white/60 p-2 shadow-[0_8px_30px_rgb(0,0,0,0.06)] backdrop-blur-xl transition-all duration-300 focus-within:bg-white/80 focus-within:ring-2 focus-within:ring-slate-300 dark:border-slate-700/50 dark:bg-slate-900/50 dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] dark:focus-within:bg-slate-900/80 dark:focus-within:ring-slate-600',
        className
      )}
      {...props}>
      <Field name="inputText">
        {(field) => {
          return (
            <Input
              type="text"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="Type a message or click a suggestion..."
              className="flex-1 border-none bg-transparent px-4 py-3 text-slate-900 shadow-none outline-none placeholder:text-slate-500 focus-visible:ring-0 dark:text-slate-100"
            />
          );
        }}
      </Field>

      <div className="flex items-center gap-1.5 pr-1">
        <Button
          type="button"
          variant={listening ? 'destructive' : 'ghost'}
          size="icon"
          onClick={listening ? handleStop : handleStart}
          className={`rounded-full transition-all ${
            !listening &&
            'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
          }`}>
          {listening ? <Square className="h-4 w-4 fill-current" /> : <Mic className="h-5 w-5" />}
          <span className="sr-only">{listening ? 'Stop' : 'Speak'}</span>
        </Button>

        <Button
          type="submit"
          size="icon"
          className="rounded-full bg-blue-600 text-white shadow-sm hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700">
          <Send className="h-4 w-4" />
          <span className="sr-only">Send</span>
        </Button>
      </div>
    </form>
  );
}
