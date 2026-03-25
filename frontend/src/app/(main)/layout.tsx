'use client';

import { redirect } from 'next/navigation';
import { useEffect, type PropsWithChildren } from 'react';

import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';

import { useAuthStore } from '@/store/auth';
import { HomeSidebar } from '@/features/home/components/sidebar';
import { Separator } from '@/components/ui/separator';

export default function MainScreensLayout({ children }: PropsWithChildren) {
  const { user } = useAuthStore((state) => state);

  useEffect(() => {
    if (!user) return redirect('/login');
  }, [user]);

  return (
    <SidebarProvider>
      <HomeSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
          </div>
        </header>
        <div className="flex flex-1">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
