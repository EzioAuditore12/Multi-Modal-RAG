import { typedFetch } from '@/lib/fetch';
import { RegisterParam } from '../schemas/param.schema';
import { env } from '@/env';
import { registerResponseSchema } from '../schemas/response.schema';

export const registerFormApi = async (data: RegisterParam) => {
  return await typedFetch({
    url: `${env.NEXT_PUBLIC_API_URL}/auth/register`,
    method: 'POST',
    body: data,
    schema: registerResponseSchema,
  });
};
