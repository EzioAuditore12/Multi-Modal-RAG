import { typedFetch } from '@/lib/fetch';
import { env } from '@/env';

import { GetChatMessagesParam } from '../schemas/get-chat-messages/param.schema';
import { getChatMessagesResponseSchema } from '../schemas/get-chat-messages/response.schema';

export const getChatMessagesApi = async (data: GetChatMessagesParam) => {
  const query = Object.fromEntries(Object.entries(data).filter(([_, v]) => v !== undefined));

  return await typedFetch({
    url: `${env.NEXT_PUBLIC_API_URL}/message`,
    method: 'GET',
    query,
    schema: getChatMessagesResponseSchema,
  });
};
