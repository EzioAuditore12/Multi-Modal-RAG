"use client";

import { type ComponentProps, useState } from "react";
import { cn } from "@/lib/utils";
import { Sidebar, SidebarBody, SidebarLink } from "../ui/sidebar";
import { Logo, LogoIcon } from "./logo";
import { links } from "./links";

export const MainLayoutSidebar = ({
  className,
  ...props
}: ComponentProps<typeof SidebarBody>) => {
  const [open, setOpen] = useState(false);
  return (
    <Sidebar open={open} setOpen={setOpen}>
      <SidebarBody
        className={cn("justify-between gap-10", className)}
        {...props}
      >
        <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
          {open ? <Logo /> : <LogoIcon />}
          <div className="mt-8 flex flex-col gap-2">
            {links.map((link, idx) => (
              <SidebarLink key={idx} link={link} />
            ))}
          </div>
        </div>
        <div className="mt-auto">
          <SidebarLink
            link={{
              label: "Manu Arora",
              href: "#",
              icon: (
                <img
                  src="https://assets.aceternity.com/manu.png"
                  className="h-7 w-7 shrink-0 rounded-full"
                  width={50}
                  height={50}
                  alt="Avatar"
                />
              ),
            }}
          />
        </div>
      </SidebarBody>
    </Sidebar>
  );
};
