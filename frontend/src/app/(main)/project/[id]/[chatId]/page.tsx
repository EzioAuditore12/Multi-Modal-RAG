'use client';

import { useParams, useSearchParams } from 'next/navigation';
import { H1 } from '@/components/ui/typography';
import { env } from '@/env';
import { useAuthenticatedServerSideEvents } from '@/lib/use-auth-sse';
import { SnowFlakeId } from '@/lib/snowflake';

export default function ChattingScreen() {
  const { id: projectId, chatId } = useParams() as { id: string; chatId: string };

  const searchParams = useSearchParams();

  const { getEventData } = useAuthenticatedServerSideEvents({
    url: `${env.NEXT_PUBLIC_API_URL}/chat/new`,
    // -> Only connect when finalText is a truthy string
    options: {
      query: {
        chatId,
        messageId: new SnowFlakeId(1).generate(),
        projectId,
        query: searchParams.get('query')!,
        isFirstTime: 'true',
      },
    },
    events: {
      message: (data) => console.log(data),
      project_title_with_chat_id: (data) => console.log(data),
      result: (data) => console.log(data),
    },
  });

  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <H1>Message: {getEventData('message')}</H1>
      <H1>Project Created: {JSON.stringify(getEventData('project_title_with_chat_id'))}</H1>
      <H1>Final Result" :{JSON.stringify(getEventData('result'))}</H1>
    </div>
  );
}
