'use client';

import type { PropsWithChildren } from 'react';
import { Pen, Settings } from 'lucide-react';
import { useParams } from 'next/navigation';

import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';

import { ProjectSidebar } from '@/features/project/components/side-bar';
import { NavItem } from '@/features/project/components/side-bar/nav-items';

import { useGetProjectChats } from '@/features/chat/hooks/use-get-project-chats';
import { useDeleteChat } from '@/features/chat/hooks/use-delete-chat';

export default function ProjectLayout({ children }: PropsWithChildren) {
  const { id } = useParams() as unknown as { id: string };

  const { data: projectChats } = useGetProjectChats({ pageSize: 10, projectId: id, search: '' });

  const flattenedProjectChats = projectChats?.pages.flat() || [];

  const { mutate } = useDeleteChat();

  const data = [
    {
      name: 'New Chat',
      url: `/project/${id}/new-chat`,
      icon: Pen,
    },
    {
      name: 'Settings',
      url: `/project/${id}/settings`,
      icon: Settings,
    },
  ] as NavItem[];
  return (
    <SidebarProvider>
      <ProjectSidebar
        onChatDelete={mutate}
        data={data}
        chats={flattenedProjectChats}
        projectId={id}
      />
      <SidebarInset>
        <header className="bg-background flex h-14 items-center gap-2 border-b px-4 lg:hidden">
          <SidebarTrigger />
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
