'use client';

import { useParams } from 'next/navigation';

import { H1, H2 } from '@/components/ui/typography';
import { useGetProject } from '@/features/home/hooks/use-get-project';
import { useUploadProjectFile } from '@/features/project/hooks/use-upload-project-file';
import { UploadProjectFileForm } from '@/features/project/components/upload-file/form';

export default function ProjectPage() {
  const { id } = useParams() as unknown as { id: string };

  const { data } = useGetProject(id);

  const { mutate, isPending } = useUploadProjectFile();
  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <H1>{data?.id}</H1>
      <H2>{data?.name}</H2>
      <UploadProjectFileForm
        projectId={data?.id!}
        handleFormSubmit={mutate}
        isFormSubmitting={isPending}
      />
    </div>
  );
}
