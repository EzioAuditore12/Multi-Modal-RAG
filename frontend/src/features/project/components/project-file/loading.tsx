import type { ComponentProps } from 'react';
import { Sparkles } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';

export function ProjectFileDetailsLoading({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div className={cn('relative', className)} {...props}>
      <div className="bg-primary/10 pointer-events-none absolute inset-x-0 top-0 mx-auto h-72 w-72 rounded-full blur-3xl" />
      <Card className="border-border/60 relative w-full max-w-2xl overflow-hidden shadow-2xl">
        <CardHeader>
          <div className="bg-primary/10 text-primary mb-2 inline-flex h-11 w-11 items-center justify-center rounded-2xl">
            <Sparkles className="size-5" />
          </div>
          <CardTitle className="text-2xl">Project file</CardTitle>
          <CardDescription>
            Checking whether this project already has an uploaded file.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-5 w-1/2" />
          <Separator />
          <div className="flex gap-3">
            <Skeleton className="h-11 w-40 rounded-full" />
            <Skeleton className="h-11 w-24 rounded-full" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
