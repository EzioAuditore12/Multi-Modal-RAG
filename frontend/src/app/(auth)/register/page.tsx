'use client';

import { RegisterForm } from '@/features/auth/register/components/form';

import { useRegisterForm } from '@/features/auth/register/hooks/use-register-form';
import AuthCard from '@/features/auth/components/auth-card';

export default function RegisterScreen() {
  const { mutate, isPending } = useRegisterForm();

  return (
    <AuthCard title="Create an account" subtitle="Join and start building multi-modal projects">
      <RegisterForm className="w-full" handleFormSubmit={mutate} isFormSubmitting={isPending} />
    </AuthCard>
  );
}
