'use client';

import { useForm } from '@tanstack/react-form';
import { Activity, type ComponentProps, useEffect, useRef, useState } from 'react';
import { useJoyride } from 'react-joyride';

import { useTutorialStore } from '@/store/tutorial';

import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { PlayCircle } from 'lucide-react';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardContent, CardDescription, CardTitle } from '@/components/ui/card';

import { cn } from '@/lib/utils';
import { type LoginParam, loginParamSchema } from '../schemas/param.schema';
import { WelcomeLoginDialog } from './welcome';

interface LoginFormProps extends ComponentProps<typeof Card> {
  handleFormSubmit: (data: LoginParam) => void;
  isFormSubmitting: boolean;
}

const steps = [
  { target: '[data-step="1"]', content: 'We have pre-filled the test email for you.' },
  { target: '[data-step="2"]', content: 'The test password is also set.' },
  { target: '[data-step="3"]', content: 'Click submit to explore the Multi-Modal RAG features.' },
];

export function LoginForm({
  className,
  handleFormSubmit,
  isFormSubmitting,
  ...props
}: LoginFormProps) {
  const { loginTutorialCompleted, setLoginTutorialCompleted } = useTutorialStore((state) => state);
  const [runTour, setRunTour] = useState(false);

  const autofilled = useRef(false);

  const form = useForm({
    defaultValues: { email: '', password: '' } as LoginParam,
    validators: { onSubmit: loginParamSchema },
    onSubmit: async ({ value }) => handleFormSubmit(value),
  });

  const { on, Tour } = useJoyride({
    continuous: true,
    steps,
    run: runTour, // Now controlled by local state
    options: {
      primaryColor: '#0ea5e9',
      backgroundColor: '#fff',
      textColor: '#0f172a',
      overlayColor: 'rgba(0, 0, 0, 0.6)',
      width: 350,
      zIndex: 1000,
    },
  });

  // End tutorial and persist state
  useEffect(() => {
    return on('tour:end', () => {
      setRunTour(false);
      setLoginTutorialCompleted(true);
    });
  }, [on, setLoginTutorialCompleted]);

  const handleConfirmOnboarding = () => {
    setRunTour(true);
    // Autofill
    form.setFieldValue('email', 'test@example.com');
    form.setFieldValue('password', 'Test@123');
    autofilled.current = true;
  };

  const handleSkipOnboarding = () => {
    setLoginTutorialCompleted(true);
    setRunTour(false);
  };

  // Derived state: Show modal if tutorial isn't done and tour isn't currently running
  const isWelcomeModalOpen = !loginTutorialCompleted && !runTour;

  return (
    <>
      {/* 1. Welcome Modal */}
      <WelcomeLoginDialog
        open={isWelcomeModalOpen}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            handleSkipOnboarding();
          }
        }}
        handleConfirmOnboarding={handleConfirmOnboarding}
      />

      {/* 2. Login Card */}
      <Card className={cn('border-muted/50 shadow-lg', className)} {...props}>
        {Tour}
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">Login</CardTitle>
            <div className="flex items-center gap-1">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger
                    render={
                      <Button
                        onClick={() => setRunTour(true)}
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground h-8 w-8"
                        disabled={runTour}>
                        <PlayCircle className="h-5 w-5" />
                      </Button>
                    }
                  />
                  <TooltipContent>Restart Tour</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          <CardDescription>Enter your credentials to access the RAG dashboard</CardDescription>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
            className="space-y-4">
            <FieldGroup>
              <form.Field name="email">
                {(field) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

                  return (
                    <Field data-step="1" className="grid gap-1.5" data-invalid={isInvalid}>
                      <FieldLabel className="text-sm font-semibold">Email Address</FieldLabel>

                      <Input
                        className={cn(field.state.meta.errors.length > 0 && 'border-destructive')}
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
                    <Field data-step="2" className="grid gap-1.5" data-invalid={isInvalid}>
                      <FieldLabel className="text-sm font-semibold">Password</FieldLabel>

                      <Input
                        className={cn(field.state.meta.errors.length > 0 && 'border-destructive')}
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
            <Button
              data-step="3"
              type="submit"
              className="mt-2 w-full transition-all active:scale-[0.98]"
              disabled={isFormSubmitting}>
              {isFormSubmitting ? (
                <span className="flex items-center gap-2">Submitting...</span>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </>
  );
}
