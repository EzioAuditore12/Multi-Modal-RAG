import { authenticatedTypedFetch } from '@/lib/auth-fetch';

import { env } from '@/env';

import type { GetProjectChatsParam } from '../schemas/get-project-chats/param.schema';
import { getProjectChatsResponseSchema } from '../schemas/get-project-chats/response.schema';

export const getProjectChatsApi = async (data: GetProjectChatsParam) => {
  const query = Object.fromEntries(Object.entries(data).filter(([_, v]) => v !== undefined));

  return await authenticatedTypedFetch({
    url: `chat`,
    method: 'GET',
    query,
    schema: getProjectChatsResponseSchema,
  });
};
