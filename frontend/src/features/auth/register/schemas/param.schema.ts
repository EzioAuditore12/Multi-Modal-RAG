import { z } from 'zod';

export const registerParamSchema = z.object({
  name: z.string().max(50),
  email: z.email().max(240),
  avatar: z.string().nullable(),
  password: z.string().nonempty().max(16),
});

export type RegisterParam = z.infer<typeof registerParamSchema>;
