import { z } from 'zod';

export const messageSchema = z.object({
  id: z.string(),
  chatId: z.string(),
  content: z.string(),
  type: z.enum(['ai', 'human']),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

export type Message = z.infer<typeof messageSchema>;
