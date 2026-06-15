'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { loginFormApi } from '../api/login.api';
import { useAuthStore } from '@/store/auth';

export function useLoginForm() {
  const { setUserDetails } = useAuthStore();

  const router = useRouter();

  return useMutation({
    mutationFn: loginFormApi,
    onSuccess: (data) => {
      setUserDetails(data.user);

      router.replace('/');
    },
    onError: (error) => {
      alert(error);
    },
  });
}
