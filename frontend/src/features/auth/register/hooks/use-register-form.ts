'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { registerFormApi } from '../api/register.api';
import { useAuthStore } from '@/store/auth';

export function useRegisterForm() {
  const { setUserDetails, setUserTokens } = useAuthStore();

  const router = useRouter();

  return useMutation({
    mutationFn: registerFormApi,
    onSuccess: (data) => {
      setUserTokens(data.tokens);

      setUserDetails(data.user);

      router.replace('/');
    },
    onError: (error) => {
      alert(error);
    },
  });
}
