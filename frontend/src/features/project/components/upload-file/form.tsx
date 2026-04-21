'use client';

import { useForm } from '@tanstack/react-form';
import { Activity, type ComponentProps } from 'react';
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

export function UploadProjectFileForm({
  projectId,
  className,
  handleFormSubmit,
  isFormSubmitting,
  ...props
}: UploadProjectFileFormProps) {
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

  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button variant="outline">
            <Upload className="mr-2" />
            Upload File
          </Button>
        }
      />
      <DialogContent className="sm:max-w-sm">
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
                  <Field data-invalid={isInvalid}>
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
            <Button type="submit" id="create-project-form" disabled={isFormSubmitting}>
              {isFormSubmitting ? 'Submitting' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
