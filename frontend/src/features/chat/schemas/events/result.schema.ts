import { z } from 'zod';
import { messageSchema } from '../message.schema';

export const chatResultEventSchema = messageSchema
  .pick({
    id: true,
    content: true,
  })
  .extend({ type: z.enum(['ai']) });

export type ChatResultEvent = z.infer<typeof chatResultEventSchema>;
