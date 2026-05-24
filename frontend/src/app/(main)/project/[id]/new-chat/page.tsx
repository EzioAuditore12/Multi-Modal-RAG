'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

import { ChatInputArea } from '@/features/chat/components/new-chat/input';
import { SuggestionGrid } from '@/features/chat/components/new-chat/suggestion-card';
import { NewChatHeroHeader } from '@/features/chat/components/new-chat/hero-header';

import { SnowFlakeId } from '@/lib/snowflake';
import { NewChatWelcome } from '@/features/chat/components/new-chat/welcome';
import { useTutorialStore } from '@/store/tutorial';

export default function NewChat() {
  const [finalText, setFinalText] = useState('');
  const [suggestedText, setSuggestedText] = useState('');

  const { id } = useParams() as unknown as { id: string };

  const router = useRouter();

  const {
    projectTutorialCompleted,
    setProjectTutorialCompleted,
    newChatProjectTutorialCompleted,
    setNewChatProjectTutorialCompleted,
  } = useTutorialStore((s) => s);
  const [screen, setScreen] = useState<'welcome' | 'options' | 'chat'>('welcome');

  const handleChatSubmit = (text: string) => {
    // -> Setting final text here will trigger a re-render where `!!finalText` is true, connecting the SSE
    setFinalText(text);

    const chatId = new SnowFlakeId(1).generate();
    const params = new URLSearchParams({ chatId: chatId.toString(), query: text });

    router.push(`/project/${id}/${chatId}?${params.toString()}`);
  };

  return (
    <div className="relative flex w-full flex-1 flex-col items-center justify-center overflow-hidden bg-linear-to-br from-slate-50 via-slate-100 to-slate-200 px-4 font-sans dark:from-slate-950 dark:via-slate-900 dark:to-black">
      <NewChatWelcome
        open={!newChatProjectTutorialCompleted}
        onOpenChange={(isOpen) => {
          if (!isOpen) setNewChatProjectTutorialCompleted(true);
          setScreen('chat');
        }}
        onUseSample={(t) => {
          setSuggestedText(t);
          setNewChatProjectTutorialCompleted(true);
          setScreen('chat');
        }}
        onSkip={() => {
          setNewChatProjectTutorialCompleted(true);
          setScreen('chat');
        }}
      />

      <div className="relative z-10 flex w-full max-w-4xl flex-col items-center pt-20 pb-10">
        <NewChatHeroHeader className="mb-12" />
        <SuggestionGrid className="mb-12 w-full max-w-3xl" onSuggestionClick={setSuggestedText} />
        <div className="mt-auto flex w-full flex-col items-center">
          <ChatInputArea
            className="w-full max-w-3xl"
            onResult={handleChatSubmit}
            suggestedText={suggestedText}
            screen={screen}
            onChangeScreen={setScreen}
          />
        </div>
      </div>
    </div>
  );
}
