import { z } from 'zod';

import { paginationSchema } from '@/features/common/schemas/pagination.schema';

export const getChatMessagesParamSchema = paginationSchema.omit({ search: true }).extend({
  chatId: z.string(),
});

export type GetChatMessagesParam = z.infer<typeof getChatMessagesParamSchema>;
