'use client';

import { LoginForm } from '@/features/auth/login/components/login-form';
import { useLoginForm } from '@/features/auth/login/hooks/use-login-form';
import AuthCard from '@/features/auth/components/auth-card';

export default function LoginScreen() {
  const { mutate, isPending } = useLoginForm();
  return (
    <AuthCard title="Welcome back" subtitle="Sign in to continue to your projects">
      <LoginForm
        id="login-form"
        className="w-full"
        handleFormSubmit={mutate}
        isFormSubmitting={isPending}
      />
    </AuthCard>
  );
}
