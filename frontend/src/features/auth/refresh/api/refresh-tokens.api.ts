import { typedFetch } from '@/lib/fetch';
import type { RefreshParam } from '../schemas/param.schema';
import { env } from '@/env';
import { refreshResponseSchema } from '../schemas/response.schema';

export const refreshTokensApi = async (data: RefreshParam) => {
  return await typedFetch({
    url: `${env.NEXT_PUBLIC_API_URL}/auth/refresh`,
    method: 'POST',
    body: data,
    schema: refreshResponseSchema,
  });
};
