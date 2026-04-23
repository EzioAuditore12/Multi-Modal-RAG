'use client';

import type { PropsWithChildren } from 'react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { useAuthStore } from '@/store/auth';

export default function AuthScreensLayout({ children }: PropsWithChildren) {
  const { user } = useAuthStore((state) => state);
  const router = useRouter();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated && user) {
      router.replace('/');
    }
  }, [user, hydrated, router]);

  if (!hydrated) return null;

  return <>{children}</>;
}
