'use client';

import { useForm } from '@tanstack/react-form';
import { Activity, type ComponentProps } from 'react';

import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

import { type RegisterParam, registerParamSchema } from '../schemas/param.schema';

interface RegisterFormProps extends ComponentProps<typeof Card> {
  handleFormSubmit: (data: RegisterParam) => void;
  isFormSubmitting: boolean;
}

export function RegisterForm({
  className,
  handleFormSubmit,
  isFormSubmitting,
  ...props
}: RegisterFormProps) {
  const form = useForm({
    defaultValues: {
      name: '',
      avatar: null,
      email: '',
      password: '',
    } as RegisterParam,
    validators: {
      onSubmit: registerParamSchema,
    },
    onSubmit: async ({ value }) => {
      handleFormSubmit(value);
    },
  });

  return (
    <Card className={cn(className)} {...props}>
      <CardHeader>Register Form</CardHeader>

      <CardContent>
        <form
          id="register-form"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}>
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
                    placeholder="Name ...."
                    autoComplete="off"
                  />
                  <Activity mode={isInvalid ? 'visible' : 'hidden'}>
                    <FieldError errors={field.state.meta.errors} />
                  </Activity>
                </Field>
              );
            }}
          </form.Field>

          <FieldGroup>
            <form.Field name="email">
              {(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="Email ...."
                      autoComplete="off"
                      type="email"
                    />
                    <Activity mode={isInvalid ? 'visible' : 'hidden'}>
                      <FieldError errors={field.state.meta.errors} />
                    </Activity>
                  </Field>
                );
              }}
            </form.Field>

            <form.Field name="password">
              {(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="Password ..."
                      autoComplete="off"
                      type="password"
                    />
                    <Activity mode={isInvalid ? 'visible' : 'hidden'}>
                      <FieldError errors={field.state.meta.errors} />
                    </Activity>
                  </Field>
                );
              }}
            </form.Field>
          </FieldGroup>

          <Button type="submit" id="register-form" disabled={isFormSubmitting}>
            {isFormSubmitting ? 'Submitting' : 'Submit'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
