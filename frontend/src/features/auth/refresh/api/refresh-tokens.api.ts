import { typedFetch } from '@/lib/fetch';
import { env } from '@/env';
import { refreshResponseSchema } from '../schemas/response.schema';

export const refreshTokensApi = async () => {
  return await typedFetch({
    url: `${env.NEXT_PUBLIC_API_URL}/auth/refresh`,
    method: 'POST',
    schema: refreshResponseSchema,
  });
};
