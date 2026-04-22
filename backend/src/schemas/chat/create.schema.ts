import { z } from 'zod';

import { chatInsertSchema } from '@/db/models/chat.model';

export const createChatSchema = chatInsertSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type CreateChat = z.infer<typeof createChatSchema>;
