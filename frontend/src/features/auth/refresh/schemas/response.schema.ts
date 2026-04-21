import { z } from 'zod';

import { tokensSchema } from '@/features/common/schemas/token.schema';

export const refreshResponseSchema = tokensSchema;

export type RefreshResponse = z.infer<typeof refreshResponseSchema>;
