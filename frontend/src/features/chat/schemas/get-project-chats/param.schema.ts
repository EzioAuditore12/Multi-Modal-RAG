import { z } from 'zod';

import { paginationSchema } from '@/features/common/schemas/pagination.schema';

export const getProjectChatsParamSchema = paginationSchema.extend({
  projectId: z.uuid(),
});

export type GetProjectChatsParam = z.infer<typeof getProjectChatsParamSchema>;
