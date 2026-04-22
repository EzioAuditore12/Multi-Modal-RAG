'use client';

import { MoreHorizontal, type LucideIcon } from 'lucide-react';
import Link, { type LinkProps } from 'next/link';

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';

// 1. Import the Tooltip components
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export type NavItem = {
  name: string;
  url: LinkProps<unknown>['href'];
  icon: LucideIcon;
};

export function NavItems({ projects }: { projects: NavItem[] }) {
  const { state } = useSidebar();

  return (
    // 2. Removed the 'group-data-[collapsible=icon]:hidden' class so it stays visible when collapsed
    <SidebarGroup>
      <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">
        Projects
      </SidebarGroupLabel>
      <SidebarMenu>
        {/* Added TooltipProvider here */}
        <TooltipProvider delay={0}>
          {projects.map((item) => (
            <SidebarMenuItem key={item.name}>
              {/* 3. Wrap with Tooltip components depending on collapse state */}
              <Tooltip>
                <TooltipTrigger
                  render={
                    <SidebarMenuButton>
                      <Link href={item.url} className="flex w-full items-center gap-2">
                        <item.icon />
                        <span>{item.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  }></TooltipTrigger>
                {/* Only show the tooltip content when the sidebar is collapsed to avoid double text */}
                {state === 'collapsed' && <TooltipContent side="right">{item.name}</TooltipContent>}
              </Tooltip>
            </SidebarMenuItem>
          ))}
        </TooltipProvider>

        <SidebarMenuItem>
          <SidebarMenuButton>
            <MoreHorizontal />
            <span>More</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
}
