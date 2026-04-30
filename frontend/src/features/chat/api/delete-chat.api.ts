import { z } from 'zod';

import { authenticatedTypedFetch } from '@/lib/auth-fetch';

export const deleteChatApi = async (id: string) => {
  return await authenticatedTypedFetch({
    url: `chat/${id}`,
    method: 'DELETE',
    schema: z.object({ result: z.string() }),
  });
};
