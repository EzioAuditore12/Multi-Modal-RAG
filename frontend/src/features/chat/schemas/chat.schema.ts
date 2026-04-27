import { z } from 'zod';

export const chatSchema = z.object({
  id: z.string(),
  projectId: z.uuid(),
  title: z.string(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

export type Chat = z.infer<typeof chatSchema>;
