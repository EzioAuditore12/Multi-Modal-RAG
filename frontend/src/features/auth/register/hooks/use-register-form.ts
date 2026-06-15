'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { registerFormApi } from '../api/register.api';
import { useAuthStore } from '@/store/auth';

export function useRegisterForm() {
  const { setUserDetails } = useAuthStore();

  const router = useRouter();

  return useMutation({
    mutationFn: registerFormApi,
    onSuccess: (data) => {
      setUserDetails(data.user);

      router.push('/');
    },
    onError: (error) => {
      alert(error);
    },
  });
}
