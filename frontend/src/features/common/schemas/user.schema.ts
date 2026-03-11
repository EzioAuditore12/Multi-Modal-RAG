import { z } from 'zod';

export const userSchema = z.object({
  id: z.uuid(),
  name: z.string().max(50),
  email: z.email().max(240),
  avatar: z.url().nullable(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

export type User = z.infer<typeof userSchema>;
