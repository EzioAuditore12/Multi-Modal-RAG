'use client';
import { useParams } from 'next/navigation';

import { H1 } from '@/components/ui/typography';

import { ProjectSettingForm } from '@/features/project/components/settings/form';
import { useGetProjectSettings } from '@/features/project/hooks/use-get-project-settings';
import { useUpdateProjectSettings } from '@/features/project/hooks/use-update-project-settings';

export default function ProjectSettingScreen() {
  const { id } = useParams() as unknown as { id: string };

  const { data, isLoading } = useGetProjectSettings(id);

  const { mutate, isPending } = useUpdateProjectSettings();

  if (isLoading)
    return (
      <div className="flex flex-1 items-center justify-center">
        <H1>Loading....</H1>
      </div>
    );

  return (
    <div className="flex flex-1 items-center justify-center p-2">
      <ProjectSettingForm
        className="w-full max-w-2xl"
        id={id}
        defaultValues={{
          embeddingModel: data?.embeddingModel,
          ragStrategy: data?.ragStrategy,
          reRankingModel: data?.reRankingModel,
        }}
        isFormSubmitting={isPending}
        handleFormSubmit={mutate}
      />
    </div>
  );
}
