'use client';

import { useForm } from '@tanstack/react-form';
import { Activity, type ComponentProps } from 'react';

import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

import { type LoginParam, loginParamSchema } from '../schemas/param.schema';

interface LoginFormProps extends ComponentProps<typeof Card> {
  handleFormSubmit: (data: LoginParam) => void;
  isFormSubmitting: boolean;
}

export function LoginForm({
  className,
  handleFormSubmit,
  isFormSubmitting,
  ...props
}: LoginFormProps) {
  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    } as LoginParam,
    validators: {
      onSubmit: loginParamSchema,
    },
    onSubmit: async ({ value }) => {
      handleFormSubmit(value);
    },
  });

  return (
    <Card className={cn(className)} {...props}>
      <CardHeader>Login Form</CardHeader>

      <CardContent>
        <form
          id="login-form"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}>
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

          <Button type="submit" id="login-form" disabled={isFormSubmitting}>
            {isFormSubmitting ? 'Submitting' : 'Submit'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
