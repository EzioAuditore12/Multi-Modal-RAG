'use client';

import type { PropsWithChildren } from 'react';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';

import { useAuthStore } from '@/store/auth';

export default function AuthScreensLayout({ children }: PropsWithChildren) {
  const { user } = useAuthStore((state) => state);

  useEffect(() => {
    if (user) return redirect('/');
  }, [user]);

  return <>{children}</>;
}
