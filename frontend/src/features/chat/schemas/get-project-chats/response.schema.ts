import { z } from 'zod';

import { chatSchema } from '../chat.schema';

export const getProjectChatsResponseSchema = chatSchema.array();

export type GetProjectChatsResponse = z.infer<typeof getProjectChatsResponseSchema>;
