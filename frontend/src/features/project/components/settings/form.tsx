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
import { Database, Layers, Zap } from 'lucide-react';
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
    <Card
      className={cn(
        'border-border/60 bg-card w-full max-w-2xl overflow-hidden rounded-2xl shadow-lg shadow-black/5',
        className
      )}>
      <CardHeader className="border-border/60 bg-card border-b px-6 pb-6">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sky-100 text-sky-600">
            <Database className="h-6 w-6" />
          </div>
          <div>
            <CardTitle>Project Settings</CardTitle>
            <CardDescription className="text-muted-foreground text-sm">
              Adjust retrieval and embedding configuration for this project.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        {...props}>
        <CardContent className="px-6 pt-6">
          <FieldGroup className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <Field className="md:col-span-2">
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-sky-500" />
                <FieldLabel htmlFor="id">ID</FieldLabel>
              </div>
              <Input
                id="id"
                name="id"
                value={id}
                readOnly
                aria-readonly="true"
                className="bg-muted/40 text-muted-foreground rounded-md px-3 py-2 font-mono text-xs"
              />
              <p className="text-muted-foreground mt-2 text-xs">Project identifier (read-only)</p>
            </Field>

            <form.Field name="embeddingModel">
              {(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-teal-500" />
                      <FieldLabel htmlFor={field.name}>Embedding Model</FieldLabel>
                    </div>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value as string}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="e.g. text-embedding-3-small"
                      autoComplete="off"
                      className="rounded-md"
                    />
                    <FieldError errors={field.state.meta.errors} />
                    <p className="text-muted-foreground mt-1 text-xs">
                      Model used to generate embeddings for documents.
                    </p>
                  </Field>
                );
              }}
            </form.Field>

            <form.Field name="ragStrategy">
              {(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <div className="flex items-center gap-2">
                      <Layers className="h-4 w-4 text-violet-500" />
                      <FieldLabel htmlFor={field.name}>RAG Strategy</FieldLabel>
                    </div>
                    <Select
                      value={(field.state.value as string | undefined) ?? ''}
                      onValueChange={(value) => field.handleChange((value ?? '') as never)}>
                      <SelectTrigger
                        id={field.name}
                        name={field.name}
                        aria-invalid={isInvalid}
                        className="w-full rounded-md">
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
                    <p className="text-muted-foreground mt-1 text-xs">
                      Retrieval strategy that balances recall, latency and cost.
                    </p>
                  </Field>
                );
              }}
            </form.Field>

            <form.Field name="reRankingModel">
              {(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-indigo-500" />
                      <FieldLabel htmlFor={field.name}>Re-ranking Model</FieldLabel>
                    </div>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value as string}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="e.g. re-ranking-model"
                      autoComplete="off"
                      className="rounded-md"
                    />
                    <FieldError errors={field.state.meta.errors} />
                    <p className="text-muted-foreground mt-1 text-xs">
                      Optional model to re-rank retrieval results for improved precision.
                    </p>
                  </Field>
                );
              }}
            </form.Field>
          </FieldGroup>
        </CardContent>

        <CardFooter className="border-border/60 justify-end border-t px-6 pt-5 pb-6">
          {isDirty && isValid ? (
            <Button
              type="submit"
              disabled={isFormSubmitting}
              className="from-primary to-accent text-primary-foreground rounded-md bg-gradient-to-r px-4 py-2">
              {isFormSubmitting ? 'Saving...' : 'Save settings'}
            </Button>
          ) : null}
        </CardFooter>
      </form>
    </Card>
  );
}
