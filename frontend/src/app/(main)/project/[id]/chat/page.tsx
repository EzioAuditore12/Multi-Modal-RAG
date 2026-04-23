'use client';

import { H1 } from '@/components/ui/typography';
import { env } from '@/env';
import { useAuthenticatedServerSideEvents } from '@/lib/use-auth-sse';

export default function Chat() {
  const { getEventData } = useAuthenticatedServerSideEvents({
    url: `${env.NEXT_PUBLIC_API_URL}/test/sse`,
    events: {
      message: (data: string) => console.log(`This is the message right now ${data}.`),
    },
  });

  return (
    <div className="flex flex-1 items-center justify-center">
      <H1>{getEventData('message')}</H1>
    </div>
  );
}
