import { z } from 'zod';

import { publicUserSchema } from '@/db/models/user.model';
import { tokensSchema } from '../token.schema';

export const loginResponseSchema = z.object({
  user: publicUserSchema,
  tokens: tokensSchema,
});

export type LoginResponse = z.infer<typeof loginResponseSchema>;
