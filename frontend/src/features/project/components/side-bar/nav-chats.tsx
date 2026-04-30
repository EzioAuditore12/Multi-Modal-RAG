'use client';

import { MessageSquare, MoreHorizontal, Trash2 } from 'lucide-react';
import Link from 'next/link';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import type { Chat } from '@/features/chat/schemas/chat.schema';
import { ComponentProps } from 'react';
import { cn } from '@/lib/utils';

interface NavChatsProps extends ComponentProps<typeof SidebarGroup> {
  chats: Chat[];
  projectId: string;
  onDelete: (id: string) => void;
}

export function NavChats({ className, chats, projectId, onDelete, ...props }: NavChatsProps) {
  const { isMobile } = useSidebar();

  if (!chats?.length) return null;

  return (
    <SidebarGroup className={cn('group-data-[collapsible=icon]:hidden', className)} {...props}>
      <SidebarGroupLabel>Recent Chats</SidebarGroupLabel>
      <SidebarMenu>
        {chats.map((chat) => (
          <SidebarMenuItem key={chat.id}>
            <SidebarMenuButton
              render={
                <Link
                  href={`/project/${projectId}/${chat.id}`}
                  className="flex w-full items-center gap-2">
                  <MessageSquare className="size-4" />
                  <span className="truncate">{chat.title}</span>
                </Link>
              }
            />
            <DropdownMenu>
              <DropdownMenuTrigger render={<SidebarMenuAction showOnHover />}>
                <MoreHorizontal />
                <span className="sr-only">More</span>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                className="w-48"
                side={isMobile ? 'bottom' : 'right'}
                align={isMobile ? 'end' : 'start'}>
                <DropdownMenuItem
                  onClick={() => onDelete(chat.id)}
                  className="text-destructive focus:text-destructive">
                  <Trash2 className="mr-2 size-4" />
                  <span>Delete Chat</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
