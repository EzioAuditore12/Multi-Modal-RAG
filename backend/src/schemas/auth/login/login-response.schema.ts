import { z } from 'zod';

import { publicUserSchema } from '@/db/models/user.model';

export const loginResponseSchema = z.object({
  user: publicUserSchema,
});

export type LoginResponse = z.infer<typeof loginResponseSchema>;
