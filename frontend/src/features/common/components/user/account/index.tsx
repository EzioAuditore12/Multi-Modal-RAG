'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import { useAuthStore } from '@/store/auth';
import { AccountOptions, AccountOptionsProps, MenuGroup } from './options';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

export function UserAvatarMenu({
  className,
  ...props
}: Omit<AccountOptionsProps, 'data' | 'children'>) {
  const { user } = useAuthStore();
  const router = useRouter(); // <-- Move useRouter here

  const menuGroups: MenuGroup[] = [
    {
      label: 'My Account',
      items: [
        { label: 'Profile', shortcut: '⇧⌘P', onPress: () => router.push('/profile') },
        { label: 'Billing', shortcut: '⌘B', onPress: () => alert('Billing') },
        { label: 'Settings', shortcut: '⌘S', onPress: () => alert('Settings') },
      ],
    },
    {
      items: [
        {
          label: 'Projects',
          children: [{ label: 'More...', onPress: () => alert('More...') }],
        },
        { label: 'New Project', shortcut: '⌘+T', onPress: () => alert('New Team') },
      ],
    },
    {
      items: [
        { label: 'GitHub', onPress: () => alert('GitHub') },
        { label: 'Support', onPress: () => alert('Support') },
        { label: 'API', disabled: true },
      ],
    },
    {
      items: [
        { label: 'Log out', shortcut: '⇧⌘Q', onPress: () => useAuthStore.getState().logout() },
      ],
    },
  ];

  return (
    <AccountOptions data={menuGroups} className={cn(className)} {...props}>
      <Avatar className="size-16">
        <AvatarImage />
        <AvatarFallback>{user?.name[0]}</AvatarFallback>
      </Avatar>
    </AccountOptions>
  );
}
