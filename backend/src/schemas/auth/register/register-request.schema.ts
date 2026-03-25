import { z } from 'zod';
import { type ValidatedRequest } from 'express-zod-safe';

import { insertUserSchema } from '@/db/models/user.model';

export const registerRequestSchema = insertUserSchema;

export type RegisterRequest = z.infer<typeof registerRequestSchema>;

export type RegisterRequestBody = ValidatedRequest<{
  body: typeof registerRequestSchema;
}>;
