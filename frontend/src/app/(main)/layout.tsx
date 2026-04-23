'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState, type PropsWithChildren } from 'react';

import { useAuthStore } from '@/store/auth';

export default function MainScreensLayout({ children }: PropsWithChildren) {
  const { user } = useAuthStore((state) => state);
  const router = useRouter();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated && !user) {
      router.replace('/login');
    }
  }, [user, hydrated, router]);

  if (!hydrated) return null;

  return <>{children}</>;
}
