'use client';

import { useParams } from 'next/navigation';
import { FileText, Sparkles, UploadCloud, ShieldCheck } from 'lucide-react';
import { useJoyride } from 'react-joyride';
import { useEffect } from 'react';
import { useTutorialStore } from '@/store/tutorial';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

import { UploadProjectFileForm } from '@/features/project/components/upload-file/form';
import { ProjectFileDetailsLoading } from '@/features/project/components/project-file/loading';
import { ProjectFileDetails } from '@/features/project/components/project-file/details';

import { useUploadProjectFile } from '@/features/project/hooks/use-upload-project-file';
import { useGetProjectFile } from '@/features/project/hooks/use-get-project-file';

const steps = [
  {
    target: '[data-step="feature-cards"]',
    content:
      'These cards explain the benefits of uploading a project file: PDF ingestion, semantic search, and protected access.',
    disableBeacon: true,
  },
  {
    target: '[data-step="upload-form"]',
    content:
      'Use this form to upload your project PDF. This will enable advanced retrieval features for your project.',
  },
];

export default function ProjectFileUploadPage() {
  const { id } = useParams() as unknown as { id: string };
  const { data, isLoading, isRefetching } = useGetProjectFile(id);
  const { mutate, isPending } = useUploadProjectFile();

  // Zustand tutorial store
  const projectTutorialCompleted = useTutorialStore((state) => state.projectTutorialCompleted);
  const setProjectTutorialCompleted = useTutorialStore(
    (state) => state.setProjectTutorialCompleted
  );

  const { on, Tour } = useJoyride({
    continuous: true,
    steps,
    run: !projectTutorialCompleted, // Directly use derived state
    options: {
      primaryColor: '#10b981',
      backgroundColor: '#fff',
      textColor: '#0f172a',
      overlayColor: 'rgba(0, 0, 0, 0.6)',
      width: 400,
      zIndex: 1000,
    },
  });

  // End tutorial and persist state
  useEffect(() => {
    return on('tour:end', () => {
      setProjectTutorialCompleted(true);
    });
  }, [on, setProjectTutorialCompleted]);

  if (isLoading && isRefetching) {
    return (
      <ProjectFileDetailsLoading className="flex flex-1 items-center justify-center overflow-hidden px-4 py-8" />
    );
  }

  if (data) {
    return <ProjectFileDetails data={data} />;
  }

  return (
    <div className="relative flex flex-1 items-center justify-center overflow-hidden px-4 py-8">
      {Tour}
      <div className="from-primary/10 via-secondary/10 to-background pointer-events-none absolute inset-0 bg-linear-to-br" />
      <div className="bg-primary/10 pointer-events-none absolute top-10 -left-16 h-64 w-64 rounded-full blur-3xl" />
      <Card className="border-border/60 relative w-full max-w-2xl overflow-hidden shadow-2xl">
        <CardHeader className="border-border/60 from-primary/5 border-b bg-linear-to-r via-transparent to-transparent">
          <div className="bg-primary/10 text-primary mb-2 inline-flex h-11 w-11 items-center justify-center rounded-2xl">
            <UploadCloud className="size-5" />
          </div>
          <CardTitle className="text-2xl">Upload your project file</CardTitle>
          <CardDescription>
            No file is attached yet. Upload a PDF to start extracting project context.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5 p-6 md:p-8">
          <div data-step="feature-cards" className="grid gap-3 sm:grid-cols-3">
            <div className="border-border/60 bg-muted/40 rounded-2xl border p-4">
              <FileText className="text-primary mb-3 size-5" />
              <p className="text-sm font-medium">PDF ready</p>
              <p className="text-muted-foreground mt-1 text-sm">
                Attach a single document for ingestion.
              </p>
            </div>
            <div className="border-border/60 bg-muted/40 rounded-2xl border p-4">
              <Sparkles className="text-primary mb-3 size-5" />
              <p className="text-sm font-medium">Semantic search</p>
              <p className="text-muted-foreground mt-1 text-sm">
                Your file can power retrieval across the chat flow.
              </p>
            </div>
            <div className="border-border/60 bg-muted/40 rounded-2xl border p-4">
              <ShieldCheck className="text-primary mb-3 size-5" />
              <p className="text-sm font-medium">Protected access</p>
              <p className="text-muted-foreground mt-1 text-sm">
                Only your authenticated project can use the file.
              </p>
            </div>
          </div>

          <Separator />

          <div
            data-step="upload-form"
            className="border-border/70 bg-background/70 rounded-2xl border border-dashed p-4 md:p-5">
            <UploadProjectFileForm
              projectId={id}
              handleFormSubmit={mutate}
              isFormSubmitting={isPending}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
