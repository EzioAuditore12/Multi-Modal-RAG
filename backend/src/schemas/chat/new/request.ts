import { z } from 'zod';
import type { ValidatedRequest } from 'express-zod-safe';

export const createNewChatSchema = z.object({
  projectId: z.uuid(),
  query: z.string().min(1).max(512),
});

export type CreateNewChat = z.infer<typeof createNewChatSchema>;

export type CreateNewChatRequest = ValidatedRequest<{
  body: typeof createNewChatSchema;
}>;
