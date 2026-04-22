import { z } from 'zod';

export const createNewChatResponseSchema = z.object({
  projectId: z.uuid(),
  chatId: z.string().describe('bigint format'),
  messageIdHuman: z.string(),
  messageIdAi: z.string(),
  title: z.string(),
  query: z.string().min(1).max(512),
  aiResponse: z.string(),
});

export type CreateNewChatResponse = z.infer<typeof createNewChatResponseSchema>;
