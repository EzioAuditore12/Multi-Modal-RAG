'use client';

import { useState, useEffect } from 'react';
import type { ComponentProps } from 'react';
import { FileText, FileUp, Link2, ShieldCheck, Sparkles, UploadCloud } from 'lucide-react';
import Link from 'next/link';
import { useJoyride } from 'react-joyride';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { ProjectFile } from '../../schemas/project-file.schema';
import { cn } from '@/lib/utils';

interface ProjectFileDetailsProps extends ComponentProps<'div'> {
  data: ProjectFile;
}

const steps = [
  {
    target: '[data-step="1"]',
    content:
      'Here you can find the details of your uploaded file, including its unique ID and the direct URL.',
    disableBeacon: true,
  },
  {
    target: '[data-step="2"]',
    content: 'Click here to start a new chat! The AI will use this document as its knowledge base.',
  },
];

export function ProjectFileDetails({ className, data, ...props }: ProjectFileDetailsProps) {
  const { fileName, id, uploadedAt, url } = data;

  // Set to true to run the tour immediately when this component mounts
  // (You could also tie this to a specific state or button click)
  const [runTour, setRunTour] = useState(true);

  const { on, Tour } = useJoyride({
    continuous: true,
    steps,
    run: runTour,
    options: {
      primaryColor: '#10b981', // Matched to the emerald-500 theme of the card
      backgroundColor: '#fff',
      textColor: '#0f172a',
      overlayColor: 'rgba(0, 0, 0, 0.6)',
      width: 400,
      zIndex: 1000,
    },
  });

  // Clean up tour state when it finishes
  useEffect(() => {
    return on('tour:end', () => {
      setRunTour(false);
    });
  }, [on]);

  return (
    <div
      className={cn(
        'relative flex flex-1 items-center justify-center overflow-hidden px-4 py-8',
        className
      )}
      {...props}>
      {/* Mount the Joyride Tour */}
      {Tour}

      <div className="from-primary/10 via-accent/10 to-background pointer-events-none absolute inset-0 bg-linear-to-br" />
      <div className="bg-primary/10 pointer-events-none absolute -top-20 -right-16 h-64 w-64 rounded-full blur-3xl" />

      <Card className="border-border/60 relative w-full max-w-4xl overflow-hidden shadow-2xl backdrop-blur">
        <CardHeader className="border-border/60 from-primary/5 border-b bg-linear-to-r via-transparent to-transparent">
          <div className="mb-2 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600">
            <FileText className="size-5" />
          </div>
          <CardTitle className="text-2xl">Project file uploaded</CardTitle>
          <CardDescription>
            This project already has a file attached, so the upload form is hidden.
          </CardDescription>
        </CardHeader>

        <CardContent className="grid gap-6 p-6 md:grid-cols-[1.2fr_0.8fr] md:items-start md:p-8">
          {/* Step 1 Target: File Details Container */}
          <div data-step="1" className="space-y-4">
            <div className="border-border/60 bg-muted/40 rounded-2xl border p-4">
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 text-primary mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
                  <FileUp className="size-5" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">File ID</p>
                  <p className="text-muted-foreground text-sm break-all">{id}</p>
                </div>
              </div>
            </div>

            <div className="border-border/60 bg-muted/40 rounded-2xl border p-4">
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 text-primary mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
                  <Link2 className="size-5" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">File URL</p>
                  <a
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary text-sm break-all underline underline-offset-4">
                    Open the uploaded file
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card border-border/60 rounded-2xl border p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <ShieldCheck className="text-primary size-4" />
              <p className="text-sm font-medium">Current status</p>
            </div>
            <div className="text-muted-foreground space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-700">
                  <Sparkles className="size-3.5" />
                </span>
                <span>File is already available for ingestion and retrieval.</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-primary/10 text-primary inline-flex h-6 w-6 items-center justify-center rounded-full">
                  <UploadCloud className="size-3.5" />
                </span>
                <span>Upload form stays hidden to avoid duplicate uploads.</span>
              </div>
            </div>

            {/* Step 2 Target: Start New Chat Button */}
            <div className="mt-5" data-step="2">
              <Link href={`/project/${id}/new-chat`} className="block">
                <Button className="w-full rounded-full">Start New Chat</Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
