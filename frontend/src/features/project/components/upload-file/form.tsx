'use client';

import { useForm } from '@tanstack/react-form';
import { Activity, type ComponentProps, useEffect, useState } from 'react';
import { useJoyride } from 'react-joyride';
import { Upload } from 'lucide-react';

import { cn } from '@/lib/utils';

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
      handleFormSubmit({ id: projectId, file: value.file });
    },
  });

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
            <DialogTitle>Upload File</DialogTitle>
            <DialogDescription>Please Upload a pdf file of max 10mb</DialogDescription>
          </DialogHeader>
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
        </form>
      </DialogContent>
    </Dialog>
  );
}
