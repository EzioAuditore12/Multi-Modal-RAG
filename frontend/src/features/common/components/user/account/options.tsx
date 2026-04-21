import type { ComponentProps } from 'react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { cn } from '@/lib/utils';

// --- Types ---
type MenuShortcut = string;

export type MenuItem = {
  label: string;
  shortcut?: MenuShortcut;
  disabled?: boolean;
  onPress?: () => void;
  children?: MenuItem[]; // For submenus
};

export type MenuGroup = {
  label?: string;
  items: MenuItem[];
};

export interface AccountOptionsProps extends ComponentProps<typeof DropdownMenuTrigger> {
  data: MenuGroup[];
}

// --- Render ---
export function AccountOptions({ className, children, data, ...props }: AccountOptionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={cn(className)} {...props}>
        {children}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40" align="start">
        {data.map((group, i) => (
          <DropdownMenuGroup key={i}>
            {group.label && <DropdownMenuLabel>{group.label}</DropdownMenuLabel>}
            {group.items.map((item, j) =>
              item.children ? (
                <DropdownMenuSub key={j}>
                  <DropdownMenuSubTrigger>{item.label}</DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      {item.children.map((sub, k) => (
                        <DropdownMenuItem key={k} onClick={sub.onPress} disabled={sub.disabled}>
                          {sub.label}
                          {sub.shortcut && (
                            <DropdownMenuShortcut>{sub.shortcut}</DropdownMenuShortcut>
                          )}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
              ) : (
                <DropdownMenuItem key={j} onClick={item.onPress} disabled={item.disabled}>
                  {item.label}
                  {item.shortcut && <DropdownMenuShortcut>{item.shortcut}</DropdownMenuShortcut>}
                </DropdownMenuItem>
              )
            )}
            {i < data.length - 1 && <DropdownMenuSeparator />}
          </DropdownMenuGroup>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
