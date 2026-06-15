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

  if (data && !isPending) {
    return <ProjectFileDetails data={data} />;
  }

  return (
    <div className="relative flex flex-1 items-center justify-center overflow-hidden px-4 py-12">
      {Tour}
      <div className="pointer-events-none absolute inset-0 bg-linear-to-br opacity-40" />
      <div className="from-primary/20 to-accent/10 absolute -top-16 -right-16 h-80 w-80 rounded-full bg-gradient-to-tr blur-3xl" />
      <div className="from-secondary/10 to-primary/5 absolute -bottom-20 -left-24 h-72 w-72 rounded-full bg-gradient-to-bl blur-3xl" />

      <Card className="border-border/60 relative w-full max-w-4xl overflow-hidden rounded-3xl shadow-2xl">
        <CardHeader className="border-border/60 flex items-start gap-6 border-b bg-linear-to-r px-8 py-6">
          <div className="flex-shrink-0">
            <div className="from-primary/10 to-accent/10 text-primary inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr">
              <UploadCloud className="h-6 w-6" />
            </div>
          </div>
          <div>
            <CardTitle className="text-2xl">Upload your project file</CardTitle>
            <CardDescription className="mt-1 text-slate-600 dark:text-slate-300">
              No file is attached yet. Upload a PDF to start extracting project context and enable
              retrieval powered features for this project.
            </CardDescription>
            <div className="mt-3 flex gap-3">
              <span className="bg-muted/70 inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium">
                <FileText className="text-primary h-4 w-4" /> PDF
              </span>
              <span className="bg-muted/70 inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium">
                <Sparkles className="text-primary h-4 w-4" /> Semantic Search
              </span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 p-8">
          <div data-step="feature-cards" className="grid gap-4 sm:grid-cols-3">
            <div className="border-border/60 bg-muted/40 flex flex-col items-start gap-3 rounded-2xl border p-5 transition-shadow hover:shadow-lg">
              <div className="bg-primary/10 text-primary flex h-12 w-12 items-center justify-center rounded-lg">
                <FileText className="h-6 w-6" />
              </div>
              <p className="text-sm font-semibold">PDF ready</p>
              <p className="text-muted-foreground mt-1 text-sm">
                Attach a single document for ingestion.
              </p>
            </div>

            <div className="border-border/60 bg-muted/40 flex flex-col items-start gap-3 rounded-2xl border p-5 transition-shadow hover:shadow-lg">
              <div className="bg-accent/10 text-accent flex h-12 w-12 items-center justify-center rounded-lg">
                <Sparkles className="h-6 w-6" />
              </div>
              <p className="text-sm font-semibold">Semantic search</p>
              <p className="text-muted-foreground mt-1 text-sm">
                Your file will power retrieval in the chat.
              </p>
            </div>

            <div className="border-border/60 bg-muted/40 flex flex-col items-start gap-3 rounded-2xl border p-5 transition-shadow hover:shadow-lg">
              <div className="bg-secondary/10 text-secondary flex h-12 w-12 items-center justify-center rounded-lg">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <p className="text-sm font-semibold">Protected access</p>
              <p className="text-muted-foreground mt-1 text-sm">
                Only this project can access the file.
              </p>
            </div>
          </div>

          <Separator />

          <div
            data-step="upload-form"
            className="border-border/60 from-background/50 to-background/30 rounded-2xl border border-dashed bg-gradient-to-b p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-medium">Upload file</h3>
              <div className="text-muted-foreground text-sm">Supported: PDF • Max 20MB</div>
            </div>

            <UploadProjectFileForm
              projectId={id}
              handleFormSubmit={mutate}
              isFormSubmitting={isPending}
            />

            <p className="text-muted-foreground mt-4 text-xs">
              We extract content and build embeddings to power search and chat features.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
