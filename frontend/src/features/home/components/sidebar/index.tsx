'use client';

import type { ComponentProps } from 'react';
import { Building, Command, Map, User } from 'lucide-react';
import Link from 'next/link';

import { NavItems, type NavItem } from './nav-items';
import { NavUser } from './nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

import { useAuthStore } from '@/store/auth';

const data = {
  projects: [
    {
      name: 'Article',
      url: '/',
      icon: User,
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
  ] as NavItem[],
};

export function HomeSidebar({ ...props }: ComponentProps<typeof Sidebar>) {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg">
              {/* Make the Link a proper flex container */}
              <Link href="/" className="flex w-full items-center gap-2">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Acme Inc</span>
                  <span className="truncate text-xs">Enterprise</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavItems projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser name={user?.name ?? ''} email={user?.email ?? ''} avatar="" logout={logout} />
      </SidebarFooter>
    </Sidebar>
  );
}
