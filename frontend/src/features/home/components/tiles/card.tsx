import Link, { type LinkProps } from 'next/link';
import type { ComponentProps } from 'react';
import type { LucideIcon } from 'lucide-react';

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import { cn } from '@/lib/utils';

export type Tile = {
  id?: string;
  title: string;
  description: string;
  icon: LucideIcon;
  href: LinkProps<unknown>['href'];
  iconColor: string;
  bgColor: string;
};

interface HomeTileCardProps extends ComponentProps<typeof Card> {
  data: Tile;
  isFirstTile?: boolean; // Added this prop
}

export function HomeTileCard({ className, data, isFirstTile, ...props }: HomeTileCardProps) {
  const { title, bgColor, icon: Icon, href, description, iconColor } = data;

  return (
    <Card
      key={title}
      data-step={isFirstTile ? '1' : undefined} // Target for Step 1
      className={cn('flex flex-col transition-shadow duration-200 hover:shadow-md', className)}
      {...props}>
      <CardHeader>
        <div
          className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg"
          style={{ backgroundColor: bgColor }}>
          <Icon className="h-6 w-6" color={iconColor} />
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>

      <CardContent className="grow">
        <CardDescription className="text-base">{description}</CardDescription>
      </CardContent>

      <CardFooter>
        <Button
          variant="secondary"
          className="group w-full"
          nativeButton={false}
          render={
            <Link
              href={href}
              data-step={isFirstTile ? '2' : undefined} // Target for Step 2
              className="flex w-full items-center justify-center">
              Get Started
              <span className="ml-2 transition-transform group-hover:translate-x-1">&rarr;</span>
            </Link>
          }
        />
      </CardFooter>
    </Card>
  );
}
