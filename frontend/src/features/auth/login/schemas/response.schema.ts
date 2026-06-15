import { z } from 'zod';

import { userSchema } from '@/features/common/schemas/user.schema';

export const loginResponseSchema = z.object({
  user: userSchema,
});

export type LoginResponse = z.infer<typeof loginResponseSchema>;
