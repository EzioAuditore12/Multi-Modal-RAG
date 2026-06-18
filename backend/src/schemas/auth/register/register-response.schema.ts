import { z } from 'zod';

import { publicUserSchema } from '@/db/models/user.model';

export const registerResponseSchema = z.object({
  user: publicUserSchema,
});

export type RegisterResponse = z.infer<typeof registerResponseSchema>;
