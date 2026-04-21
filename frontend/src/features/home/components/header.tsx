'use client';

import type { ComponentProps, PropsWithChildren, ReactNode } from 'react';

import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/auth';
import { UserAvatarMenu } from '@/features/common/components/user/account';

interface HomeHeaderProps extends ComponentProps<'div'> {}

export function HomeHeader({ className, ...props }: HomeHeaderProps) {
  const { user } = useAuthStore((state) => state);

  return (
    <div className={cn('relative', className)} {...props}>
      <UserAvatarMenu className="absolute right-0" />

      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      <p className="text-muted-foreground">
        Explore the power of AI. Select a project you created below to get started.
      </p>
    </div>
  );
}
