import { typedFetch } from '@/lib/fetch';
import { LoginParam } from '../schemas/param.schema';
import { env } from '@/env';
import { loginResponseSchema } from '../schemas/response.schema';

export const loginFormApi = async (data: LoginParam) => {
  return await typedFetch({
    url: `${env.NEXT_PUBLIC_API_URL}/auth/login`,
    method: 'POST',
    body: data,
    schema: loginResponseSchema,
  });
};
