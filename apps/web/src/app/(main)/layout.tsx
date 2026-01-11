import type { PropsWithChildren } from "react";
import { MainLayoutSidebar } from "@/components/main-layout-sidebar";

export default function MainLayout({ children }: PropsWithChildren) {
  return (
    <div className="mx-auto min-h-screen flex w-full flex-1 flex-col overflow-hidden rounded-md border border-neutral-200 bg-gray-100 md:flex-row dark:border-neutral-700 dark:bg-neutral-800">
      <MainLayoutSidebar />
      {children}
    </div>
  );
}
