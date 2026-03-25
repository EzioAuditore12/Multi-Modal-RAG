import { z } from 'zod';
import type { ValidatedRequest } from 'express-zod-safe';

import { selectUserSchema } from '@/db/models/user.model';

export const loginRequestSchema = selectUserSchema.pick({
  email: true,
  password: true,
});

export type LoginRequest = z.infer<typeof loginRequestSchema>;

export type LoginRequestBody = ValidatedRequest<{
  body: typeof loginRequestSchema;
}>;
