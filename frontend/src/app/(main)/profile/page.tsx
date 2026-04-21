'use client';

import { H1, H2, P } from '@/components/ui/typography';
import { useGetProfile } from '@/features/common/hooks/use-get-profile';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardHeader, CardContent } from '@/components/ui/card';

export default function ProfilePage() {
  const { data, isLoading } = useGetProfile();

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-1 items-center justify-center">
        <Card className="h-60 w-80 animate-pulse" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex min-h-screen flex-1 items-center justify-center">
        <P>No profile data found.</P>
      </div>
    );
  }

  return (
    <div className="bg-background flex min-h-screen flex-1 items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-col items-center gap-4 pt-8">
          <Avatar className="size-20">
            <AvatarImage src={data.avatar || undefined} />
            <AvatarFallback>{data.name?.[0]}</AvatarFallback>
          </Avatar>
          <H1 className="text-center">{data.name}</H1>
          <H2 className="text-muted-foreground text-center">{data.email}</H2>
        </CardHeader>
        <CardContent>
          <P className="mt-2 text-center">Welcome to your profile page!</P>
          <P className="text-muted-foreground mt-2 text-center text-xs">
            Member since {new Date(data.createdAt).toLocaleDateString()}
          </P>
        </CardContent>
      </Card>
    </div>
  );
}
