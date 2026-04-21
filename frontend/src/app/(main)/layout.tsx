'use client';

import { redirect } from 'next/navigation';
import { useEffect, type PropsWithChildren } from 'react';

import { useAuthStore } from '@/store/auth';

export default function MainScreensLayout({ children }: PropsWithChildren) {
  const { user } = useAuthStore((state) => state);

  useEffect(() => {
    if (!user) return redirect('/login');
  }, [user]);

  return <>{children}</>;
}
