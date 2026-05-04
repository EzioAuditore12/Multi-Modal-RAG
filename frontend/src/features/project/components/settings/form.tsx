'use client';

import type { ComponentProps } from 'react';
import { useForm, useStore } from '@tanstack/react-form';

import { cn } from '@/lib/utils';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import {
  updateProjectSettingsParamSchema,
  UpdateProjectSettingsParamSchema,
} from '../../schemas/update-project-settings/param.schema';

interface ProjectSettingFormProps extends Omit<ComponentProps<'form'>, 'onSubmit'> {
  id: string;
  defaultValues: Omit<UpdateProjectSettingsParamSchema, 'id'>;
  handleFormSubmit: (data: UpdateProjectSettingsParamSchema) => void;
  isFormSubmitting: boolean;
}

export function ProjectSettingForm({
  className,
  id,
  defaultValues,
  handleFormSubmit,
  isFormSubmitting = false,
  ...props
}: ProjectSettingFormProps) {
  const form = useForm({
    defaultValues,
    validators: {
      onSubmit: updateProjectSettingsParamSchema.omit({ id: true }),
    },
    onSubmit: async ({ value }) => {
      handleFormSubmit({ id, ...value });
    },
  });

  const isDirty = useStore(form.store, (state) => state.isDirty);
  const isValid = useStore(form.store, (state) => state.isValid);

  return (
    <Card className={cn('border-border/60 w-full max-w-2xl shadow-lg shadow-black/5', className)}>
      <CardHeader className="border-border/60 border-b pb-5">
        <CardTitle>Project Settings</CardTitle>
        <CardDescription>
          Adjust the retrieval and embedding configuration for this project.
        </CardDescription>
      </CardHeader>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        {...props}>
        <CardContent className="pt-6">
          <FieldGroup className="gap-5">
            <Field>
              <FieldLabel htmlFor="id">ID</FieldLabel>
              <Input
                id="id"
                name="id"
                value={id}
                readOnly
                aria-readonly="true"
                className="bg-muted/40 text-muted-foreground font-mono text-xs"
              />
            </Field>

            <form.Field name="embeddingModel">
              {(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Embedding Model</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value as string}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="e.g. text-embedding-3-small"
                      autoComplete="off"
                    />
                    <FieldError errors={field.state.meta.errors} />
                  </Field>
                );
              }}
            </form.Field>

            <form.Field name="ragStrategy">
              {(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>RAG Strategy</FieldLabel>
                    <Select
                      value={(field.state.value as string | undefined) ?? ''}
                      onValueChange={(value) => field.handleChange((value ?? '') as never)}>
                      <SelectTrigger
                        id={field.name}
                        name={field.name}
                        aria-invalid={isInvalid}
                        className="w-full">
                        <SelectValue placeholder="Select a strategy" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="basic">Basic</SelectItem>
                        <SelectItem value="hybrid">Hybrid</SelectItem>
                        <SelectItem value="multi-query-vector">Multi-query vector</SelectItem>
                        <SelectItem value="multi-query-hybrid">Multi-query hybrid</SelectItem>
                      </SelectContent>
                    </Select>
                    <FieldError errors={field.state.meta.errors} />
                  </Field>
                );
              }}
            </form.Field>

            <form.Field name="reRankingModel">
              {(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Re-ranking Model</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value as string}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="e.g. re-ranking-model"
                      autoComplete="off"
                    />
                    <FieldError errors={field.state.meta.errors} />
                  </Field>
                );
              }}
            </form.Field>
          </FieldGroup>
        </CardContent>

        <CardFooter className="border-border/60 justify-end border-t pt-5">
          {isDirty && isValid ? (
            <Button type="submit" disabled={isFormSubmitting}>
              {isFormSubmitting ? 'Saving...' : 'Save settings'}
            </Button>
          ) : null}
        </CardFooter>
      </form>
    </Card>
  );
}
