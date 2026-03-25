import { z } from 'zod';

import { publicUserSchema } from '@/db/models/user.model';
import { tokensSchema } from '../token.schema';

export const registerResponseSchema = z.object({
  user: publicUserSchema,
  tokens: tokensSchema,
});

export type RegisterResponse = z.infer<typeof registerResponseSchema>;
