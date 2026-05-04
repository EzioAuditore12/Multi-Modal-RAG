'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="flex flex-1 items-center justify-center p-2">
      <Card className="border-border/60 w-full max-w-2xl shadow-lg shadow-black/5">
        <CardHeader className="border-border/60 border-b pb-5">
          <CardTitle>
            <Skeleton className="h-6 w-40" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-80 max-w-full" />
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-6">
          <div className="space-y-5">
            <div className="space-y-2">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>

            <div className="space-y-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>

            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
          </div>
        </CardContent>

        <div className="border-border/60 flex justify-end border-t px-6 pt-5 pb-6">
          <Skeleton className="h-10 w-32 rounded-md" />
        </div>
      </Card>
    </div>
  );
}
