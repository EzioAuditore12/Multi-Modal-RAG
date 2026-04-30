import { z } from 'zod';
import type { ValidatedRequest } from 'express-zod-safe';

import { paginationSchema } from '@/schemas/pagination.schema';

export const getChatMessagesSchema = paginationSchema
  .omit({ search: true })
  .extend({
    chatId: z.coerce.bigint(),
    cursor: z.coerce.bigint().optional(),
  });

export type GetChatMessages = z.infer<typeof getChatMessagesSchema>;

export type GetChatMessagesRequest = ValidatedRequest<{
  query: typeof getChatMessagesSchema;
}>;
