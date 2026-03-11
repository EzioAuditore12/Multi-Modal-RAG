'use client';

import { RegisterForm } from '@/features/auth/register/components/form';

import { useRegisterForm } from '@/features/auth/register/hooks/use-register-form';

export default function LoginScreen() {
  const { mutate, isPending } = useRegisterForm();

  return (
    <div className="flex min-h-screen flex-1 items-center justify-center p-2">
      <RegisterForm
        className="w-full max-w-4xl"
        handleFormSubmit={mutate}
        isFormSubmitting={isPending}
      />
    </div>
  );
}
