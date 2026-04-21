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
  title: string;
  description: string;
  icon: LucideIcon;
  href: LinkProps<unknown>['href'];
  iconColor: string;
  bgColor: string;
};

interface HomeTileCardProps extends ComponentProps<typeof Card> {
  data: Tile;
}

export function HomeTileCard({ className, data, ...props }: HomeTileCardProps) {
  const { title, bgColor, icon: Icon, href, description, iconColor } = data;

  return (
    <Card
      key={title}
      className={cn('flex flex-col transition-shadow duration-200 hover:shadow-md', className)}
      {...props}>
      <CardHeader>
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg" color={bgColor}>
          <Icon className="h-6 w-6" color={iconColor} />
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>

      <CardContent className="grow">
        <CardDescription className="text-base">{description}</CardDescription>
      </CardContent>

      <CardFooter>
        <Button variant="secondary" className="group w-full">
          <Link href={href} className="flex w-full items-center justify-center">
            Get Started
            <span className="ml-2 transition-transform group-hover:translate-x-1">&rarr;</span>
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
