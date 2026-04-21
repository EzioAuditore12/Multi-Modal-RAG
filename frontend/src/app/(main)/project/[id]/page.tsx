'use client';

import { H1, H2 } from '@/components/ui/typography';
import { useGetProject } from '@/features/home/hooks/use-get-project';
import { useParams } from 'next/navigation';

export default function ProjectPage() {
  const { id } = useParams() as unknown as { id: string };

  const { data } = useGetProject(id);

  console.log(data);

  return (
    <div className="flex min-h-screen flex-1 flex-col items-center justify-center">
      <H1>{data?.id}</H1>
      <H2>{data?.name}</H2>
    </div>
  );
}
