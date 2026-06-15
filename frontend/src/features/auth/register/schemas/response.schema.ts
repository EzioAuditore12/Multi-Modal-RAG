import { z } from 'zod';

import { userSchema } from '@/features/common/schemas/user.schema';

export const registerResponseSchema = z.object({
  user: userSchema,
});

export type RegisterResponse = z.infer<typeof registerResponseSchema>;
