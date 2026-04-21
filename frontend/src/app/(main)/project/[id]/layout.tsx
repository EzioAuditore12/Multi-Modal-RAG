import type { PropsWithChildren } from 'react';

import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { ProjectSidebar } from '@/features/project/components/side-bar';

export default function ProjectLayout({ children }: PropsWithChildren) {
  return (
    <SidebarProvider className="relative">
      <ProjectSidebar />
      <SidebarInset>{children}</SidebarInset>
      <SidebarTrigger className="absolute top-2 right-4" />
    </SidebarProvider>
  );
}
