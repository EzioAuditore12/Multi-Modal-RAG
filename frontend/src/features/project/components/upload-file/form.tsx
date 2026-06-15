'use client';

import { useForm } from '@tanstack/react-form';
import { Activity, type ComponentProps, useEffect, useState } from 'react';
import { useJoyride } from 'react-joyride';
import { Upload, CheckCircle2, Loader2 } from 'lucide-react';

import { cn } from '@/lib/utils';
import { useAuthenticatedServerSideEvents } from '@/lib/use-auth-sse';
import { env } from '@/env';

import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import {
  uploadProjectFileParamSchema,
  type UploadProjectFileParam,
} from '../../schemas/upload-project-file/param.schema';

interface UploadProjectFileFormProps extends ComponentProps<'form'> {
  projectId: string;
  handleFormSubmit: (data: UploadProjectFileParam) => void;
  isFormSubmitting: boolean;
}

const steps = [
  {
    target: '[data-step="1"]',
    content: 'Select the PDF file you want to upload for your project.',
    disableBeacon: true,
  },
  {
    target: '[data-step="2"]',
    content: 'Click here to submit and upload your file.',
  },
];

export function UploadProjectFileForm({
  projectId,
  className,
  handleFormSubmit,
  isFormSubmitting,
  ...props
}: UploadProjectFileFormProps) {
  const [runTour, setRunTour] = useState(false);

  const form = useForm({
    defaultValues: {
      file: new DataTransfer().files,
    } as Omit<UploadProjectFileParam, 'id'>,
    validators: {
      onSubmit: uploadProjectFileParamSchema.omit({ id: true }),
    },
    onSubmit: async ({ value }) => {
      setUploadStatuses(['Preparing upload...']);
      handleFormSubmit({ id: projectId, file: value.file });
    },
  });

  const [uploadStatuses, setUploadStatuses] = useState<string[]>([]);

  useAuthenticatedServerSideEvents<'status' | 'error'>({
    url: `${env.NEXT_PUBLIC_API_URL}/project/project-file/${projectId}/status`,
    enabled: isFormSubmitting,
    events: {
      status: (data) => {
        try {
          const parsed = JSON.parse(data);
          setUploadStatuses((prev) => [...prev, parsed]);
        } catch {
          setUploadStatuses((prev) => [...prev, data]);
        }
      },
      error: (data) => {
        try {
          const parsed = JSON.parse(data);
          setUploadStatuses((prev) => [...prev, `Error: ${parsed}`]);
        } catch {
          setUploadStatuses((prev) => [...prev, `Error: ${data}`]);
        }
      },
    },
  });

  const showTimeline = isFormSubmitting || uploadStatuses.length > 0;

  const { on, Tour } = useJoyride({
    continuous: true,
    steps,
    run: runTour,
    options: {
      primaryColor: '#10b981',
      backgroundColor: '#fff',
      textColor: '#0f172a',
      overlayColor: 'rgba(0, 0, 0, 0.6)',
      width: 400,
      zIndex: 1000,
    },
  });

  useEffect(() => {
    return on('tour:end', () => setRunTour(false));
  }, [on]);

  // Optionally, start the tour when the dialog opens
  const handleDialogOpen = (open: boolean) => {
    if (open) setRunTour(true);
    else setRunTour(false);
  };

  return (
    <Dialog onOpenChange={handleDialogOpen}>
      <DialogTrigger
        render={
          <Button variant="outline">
            <Upload className="mr-2" />
            Upload File
          </Button>
        }
      />
      <DialogContent className="sm:max-w-sm">
        {Tour}
        <form
          className={cn('flex flex-col gap-y-2 p-2', className)}
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          {...props}>
          <DialogHeader>
            <DialogTitle>{showTimeline ? 'Processing Upload' : 'Upload File'}</DialogTitle>
            <DialogDescription>
              {showTimeline
                ? 'Please wait while we process and index your document. This might take a few moments.'
                : 'Please Upload a pdf file of max 10mb'}
            </DialogDescription>
          </DialogHeader>

          {showTimeline ? (
            <div className="flex max-h-[60vh] flex-col gap-4 overflow-y-auto px-2 py-6">
              <div className="relative space-y-4">
                {/* Vertical line connecting the items */}
                {uploadStatuses.length > 1 && (
                  <div className="bg-border absolute top-4 bottom-4 left-3 z-0 w-px" />
                )}
                {uploadStatuses.length === 0 && (
                  <div className="relative z-10 flex items-start gap-4">
                    <div className="bg-background mt-0.5">
                      <Loader2 className="text-primary h-6 w-6 animate-spin" />
                    </div>
                    <div className="flex-1">
                      <p className="text-foreground text-sm font-medium">Starting upload...</p>
                    </div>
                  </div>
                )}
                {uploadStatuses.map((status, index) => {
                  const isLast = index === uploadStatuses.length - 1;
                  const isError = status.toLowerCase().includes('error');
                  return (
                    <div key={index} className="relative z-10 flex items-start gap-4">
                      <div className="bg-background mt-0.5">
                        {isError ? (
                          <div className="bg-destructive/10 flex h-6 w-6 items-center justify-center rounded-full">
                            <div className="bg-destructive h-2 w-2 rounded-full" />
                          </div>
                        ) : isLast && isFormSubmitting ? (
                          <Loader2 className="text-primary h-6 w-6 animate-spin" />
                        ) : (
                          <CheckCircle2 className="h-6 w-6 text-green-500" />
                        )}
                      </div>
                      <div className="flex-1 pb-2">
                        <p
                          className={cn(
                            'text-sm font-medium',
                            isError ? 'text-destructive' : 'text-foreground'
                          )}>
                          {status}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <>
              <FieldGroup>
                <form.Field name="file">
                  {(field) => {
                    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-step="1" data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>File</FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          onBlur={field.handleBlur}
                          onChange={(e) =>
                            field.handleChange(e.target.files || new DataTransfer().files)
                          }
                          aria-invalid={isInvalid}
                          placeholder="Project File..."
                          type="file"
                        />
                        <Activity mode={isInvalid ? 'visible' : 'hidden'}>
                          <FieldError errors={field.state.meta.errors} />
                        </Activity>
                      </Field>
                    );
                  }}
                </form.Field>
              </FieldGroup>
              <DialogFooter>
                <DialogClose
                  render={
                    <Button variant="outline" type="button">
                      Cancel
                    </Button>
                  }
                />
                <Button
                  data-step="2"
                  type="submit"
                  id="create-project-form"
                  disabled={isFormSubmitting}>
                  {isFormSubmitting ? 'Submitting' : 'Create'}
                </Button>
              </DialogFooter>
            </>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}
