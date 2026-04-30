import { z } from 'zod';

import { messageSchema } from '../message.schema';

export const getChatMessagesResponseSchema = messageSchema.array();

export type GetChatMessagesResponse = z.infer<typeof getChatMessagesResponseSchema>;
