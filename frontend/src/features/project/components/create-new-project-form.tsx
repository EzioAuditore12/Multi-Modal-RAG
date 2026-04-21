'use client';

import { useForm } from '@tanstack/react-form';
import { Activity, type ComponentProps } from 'react';
import { Plus } from 'lucide-react';

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
  CreateNewProjectParam,
  createNewProjectParamSchema,
} from '../schemas/create-new-project/param.schema';

interface CreateNewProjectFormProps extends ComponentProps<'form'> {
  handleFormSubmit: (data: CreateNewProjectParam) => void;
  isFormSubmitting: boolean;
}

export function CreateNewProjectForm({
  className,
  handleFormSubmit,
  isFormSubmitting,
  ...props
}: CreateNewProjectFormProps) {
  const form = useForm({
    defaultValues: {
      name: '',
      description: '',
    } as CreateNewProjectParam,
    validators: {
      onSubmit: createNewProjectParamSchema,
    },
    onSubmit: async ({ value }) => {
      handleFormSubmit(value);
    },
  });

  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button variant="outline">
            <Plus className="mr-2" />
            New Project
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
            <DialogTitle>Create New Project</DialogTitle>
            <DialogDescription>
              Fill in the details below to create a new project.
            </DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <form.Field name="name">
              {(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="Project name..."
                      autoComplete="off"
                    />
                    <Activity mode={isInvalid ? 'visible' : 'hidden'}>
                      <FieldError errors={field.state.meta.errors} />
                    </Activity>
                  </Field>
                );
              }}
            </form.Field>

            <form.Field name="description">
              {(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Description</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="Project description..."
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
