import { z } from 'zod';

export const messageChunkEventSchema = z.object({
  text: z.string(),
});

export type MessageChunkEvent = z.infer<typeof messageChunkEventSchema>;
