import { z } from 'zod';
import type { ValidatedRequest } from 'express-zod-safe';

export const createNewChatSchema = z.object({
  chatId: z.coerce.bigint(),
  messageId: z.coerce.bigint(),
  projectId: z.uuid(),
  query: z.string().min(1).max(512),
  isFirstTime: z
    .string()
    .optional()
    .transform((v) => v === 'true'),
});

export type CreateNewChat = z.infer<typeof createNewChatSchema>;

export type CreateNewChatRequest = ValidatedRequest<{
  query: typeof createNewChatSchema;
}>;
