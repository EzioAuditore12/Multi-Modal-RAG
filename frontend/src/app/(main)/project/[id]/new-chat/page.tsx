'use client';

import { useState, useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { Mic, Square, Sparkles, Network } from 'lucide-react';

// shadcn component imports
import { H1 } from '@/components/ui/typography';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// --- 1. HeroHeader ---
function HeroHeader() {
  return (
    <div className="mb-12 text-center">
      <H1 className="tracking-tight text-slate-900 dark:text-slate-50">
        Hello, how can I help you today?
      </H1>
    </div>
  );
}

// --- 2. SuggestionCard ---
function SuggestionCard({
  title,
  icon: Icon,
  onClick,
}: {
  title: string;
  icon: any;
  onClick: (t: string) => void;
}) {
  return (
    <button
      onClick={() => onClick(title)}
      className="flex w-full flex-col items-start justify-between rounded-2xl border border-slate-200 bg-white p-6 text-left transition-all hover:-translate-y-1 hover:shadow-md dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-900">
      <Icon className="mb-4 h-5 w-5 text-slate-500 dark:text-slate-400" />
      <span className="font-medium text-slate-700 dark:text-slate-300">{title}</span>
    </button>
  );
}

// --- 3. SuggestionGrid ---
function SuggestionGrid({ onSuggestionClick }: { onSuggestionClick: (t: string) => void }) {
  return (
    <div className="mb-12 grid w-full max-w-3xl grid-cols-1 gap-4 md:grid-cols-2">
      <SuggestionCard
        title="Summarize the project (What is the main point?)"
        icon={Sparkles}
        onClick={onSuggestionClick}
      />
      <SuggestionCard
        title="Explain quantum entanglement"
        icon={Network}
        onClick={onSuggestionClick}
      />
    </div>
  );
}

// --- 4. ChatInputArea (Featuring Monochromatic Liquid Glass) ---
function ChatInputArea({
  onResult,
  suggestedText,
}: {
  onResult: (t: string) => void;
  suggestedText: string;
}) {
  const { transcript, listening, resetTranscript } = useSpeechRecognition();
  const [inputText, setInputText] = useState('');

  useEffect(() => {
    if (suggestedText) setInputText(suggestedText);
  }, [suggestedText]);

  useEffect(() => {
    if (transcript) setInputText(transcript);
  }, [transcript]);

  const handleStart = () => {
    resetTranscript();
    setInputText('');
    SpeechRecognition.startListening({ continuous: false });
  };

  const handleStop = () => {
    SpeechRecognition.stopListening();
    onResult(inputText || transcript);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onResult(inputText);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-3xl items-center gap-2 rounded-full border border-white bg-white/60 p-2 shadow-[0_8px_30px_rgb(0,0,0,0.06)] backdrop-blur-xl transition-all duration-300 focus-within:bg-white/80 focus-within:ring-2 focus-within:ring-slate-300 dark:border-slate-700/50 dark:bg-slate-900/50 dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] dark:focus-within:bg-slate-900/80 dark:focus-within:ring-slate-600">
      <Input
        type="text"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder="Type a message or click a suggestion..."
        className="flex-1 border-none bg-transparent px-4 py-3 text-slate-900 shadow-none outline-none placeholder:text-slate-500 focus-visible:ring-0 dark:text-slate-100"
      />
      <Button
        type="button"
        variant={listening ? 'destructive' : 'secondary'}
        onClick={listening ? handleStop : handleStart}
        className={`rounded-full px-6 shadow-sm transition-all ${
          !listening &&
          'border border-slate-200 bg-white text-slate-900 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700'
        }`}>
        {listening ? (
          <Square className="mr-2 h-4 w-4 fill-current" />
        ) : (
          <Mic className="mr-2 h-4 w-4" />
        )}
        {listening ? 'Stop' : 'Speak'}
      </Button>
    </form>
  );
}

// --- 5. VoiceResultDisplay ---
function VoiceResultDisplay({ result }: { result: string }) {
  if (!result) return null;
  return (
    <div className="mt-6 w-full max-w-3xl rounded-xl border border-slate-200 bg-slate-100 p-4 text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
      <span className="mr-2 font-semibold text-slate-900 dark:text-slate-100">Ready to Send:</span>
      {result}
    </div>
  );
}

// --- Main Chat Layout ---
export default function NewChat() {
  const [finalText, setFinalText] = useState('');
  const [suggestedText, setSuggestedText] = useState('');

  const handleChatSubmit = (text: string) => {
    setFinalText(text);
  };

  return (
    /* A very subtle, monochromatic background gradient is used here. 
      It's necessary for the glass effect on the input to reflect against something, 
      but it remains professional and non-distracting. 
    */
    <div className="relative flex w-full flex-1 flex-col items-center justify-center overflow-hidden bg-linear-to-br from-slate-50 via-slate-100 to-slate-200 px-4 font-sans dark:from-slate-950 dark:via-slate-900 dark:to-black">
      <div className="relative z-10 flex w-full max-w-4xl flex-col items-center pt-20 pb-10">
        <HeroHeader />
        <SuggestionGrid onSuggestionClick={setSuggestedText} />

        <div className="mt-auto flex w-full flex-col items-center">
          <ChatInputArea onResult={handleChatSubmit} suggestedText={suggestedText} />
          <VoiceResultDisplay result={finalText} />
        </div>
      </div>
    </div>
  );
}
