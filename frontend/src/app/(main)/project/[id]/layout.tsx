'use client';

import type { PropsWithChildren } from 'react';

import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { ProjectSidebar } from '@/features/project/components/side-bar';
import { NavItem } from '@/features/project/components/side-bar/nav-items';
import { Building, Map, Pen } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useGetProjectChats } from '@/features/chat/hooks/use-get-project-chats';

export default function ProjectLayout({ children }: PropsWithChildren) {
  const { id } = useParams() as unknown as { id: string };

  const { data: projectChats } = useGetProjectChats({ pageSize: 10, projectId: id, search: '' });

  const flattenedProjectChats = projectChats?.pages.flat() || [];

  console.log(flattenedProjectChats);

  const data = [
    {
      name: 'New Chat',
      url: `/project/${id}/new-chat`,
      icon: Pen,
    },
    {
      name: 'Create Property',
      url: '/',
      icon: Map,
    },
    {
      name: 'Manage Properties',
      url: '/',
      icon: Building,
    },
  ] as NavItem[];
  return (
    <SidebarProvider>
      <ProjectSidebar data={data} chats={flattenedProjectChats} projectId={id} />
      <SidebarInset>
        <header className="bg-background flex h-14 items-center gap-2 border-b px-4 lg:hidden">
          <SidebarTrigger />
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
