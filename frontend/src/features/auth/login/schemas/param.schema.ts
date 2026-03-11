import { z } from 'zod';

export const loginParamSchema = z.object({
  email: z.email().max(240),
  password: z.string().nonempty().max(16),
});

export type LoginParam = z.infer<typeof loginParamSchema>;
