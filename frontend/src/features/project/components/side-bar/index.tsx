'use client';

import type { ComponentProps } from 'react';
import { Command } from 'lucide-react';
import Link from 'next/link';

import { NavItems, type NavItem } from './nav-items';
import { NavUser } from './nav-user';
import { NavChats } from './nav-chats';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';

import { useAuthStore } from '@/store/auth';
import { cn } from '@/lib/utils';

import type { Chat } from '@/features/chat/schemas/chat.schema';

interface ProjectSidebarProps extends ComponentProps<typeof Sidebar> {
  data: NavItem[];
  onChatDelete: (id: string) => void;
  chats?: Chat[];
  projectId?: string;
}

export function ProjectSidebar({
  className,
  data,
  chats = [],
  projectId = '',
  onChatDelete,
  ...props
}: ProjectSidebarProps) {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const { state } = useSidebar(); // Access sidebar state

  return (
    <Sidebar className={cn(className)} collapsible="icon" variant="inset" {...props}>
      {/* Set collapsible to "icon" so it partially shrinks */}
      <SidebarHeader className="flex h-16 shrink-3 items-center gap-2">
        <SidebarMenu>
          <SidebarMenuItem>
            {/* Provide the Trigger when collapsed, otherwise show original header */}
            {state === 'collapsed' ? (
              <div className="flex w-full items-center justify-center pt-2">
                <SidebarTrigger />
              </div>
            ) : (
              <div className="flex w-full items-center gap-2 py-2 pr-2">
                <SidebarMenuButton size="lg">
                  <Link href="/" className="flex flex-1 items-center gap-2">
                    <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                      <Command className="size-4" />
                    </div>
                    <div className="grid flex-1 flex-row text-left text-sm leading-tight">
                      <span className="truncate font-medium">Rag Sphere</span>
                      <span className="truncate text-xs">Enterprise</span>
                    </div>
                  </Link>
                </SidebarMenuButton>
                <SidebarTrigger />
              </div>
            )}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavItems projects={data} />
        <NavChats chats={chats} projectId={projectId} onDelete={onChatDelete} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser name={user?.name ?? ''} email={user?.email ?? ''} avatar="" logout={logout} />
      </SidebarFooter>
    </Sidebar>
  );
}
