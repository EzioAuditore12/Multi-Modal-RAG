import { z } from 'zod';
import type { ValidatedRequest } from 'express-zod-safe';

export const chatParamSchema = z.object({
  id: z.coerce.bigint(),
});

export type ChatParam = z.infer<typeof chatParamSchema>;

export type ChatParamRequest = ValidatedRequest<{
  params: typeof chatParamSchema;
}>;
