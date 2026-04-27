import { z } from 'zod';
import type { ValidatedRequest } from 'express-zod-safe';

import { paginationSchema } from '../pagination.schema';

export const getProjectChatsSchema = paginationSchema.extend({
  projectId: z.uuid(),
  cursor: z.coerce.bigint().optional(),
});

export type GetProjectChats = z.infer<typeof getProjectChatsSchema>;
export type GetProjectChatsRequest = ValidatedRequest<{
  query: typeof getProjectChatsSchema;
}>;
