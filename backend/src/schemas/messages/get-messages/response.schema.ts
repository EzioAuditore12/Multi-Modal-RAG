import { z } from 'zod';

import { messageSchema } from '@/db/models/message.model';

export const getMessagesResponseSchema = z.array(
  messageSchema.extend({
    id: z.string(),
    chatId: z.string(),
  }),
);

export type GetMessagesResponse = z.infer<typeof getMessagesResponseSchema>;
