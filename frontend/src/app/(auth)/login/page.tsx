'use client';

import { LoginForm } from '@/features/auth/login/components/login-form';
import { useLoginForm } from '@/features/auth/login/hooks/use-login-form';

export default function LoginScreen() {
  const { mutate, isPending } = useLoginForm();
  return (
    <div className="flex min-h-screen flex-1 items-center justify-center p-2">
      <LoginForm
        id="login-form"
        className="w-full max-w-4xl"
        handleFormSubmit={mutate}
        isFormSubmitting={isPending}
      />
    </div>
  );
}
