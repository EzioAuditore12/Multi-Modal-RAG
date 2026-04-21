import { z } from 'zod';

export const projectSchema = z.object({
  id: z.uuid(),
  userId: z.uuid(),
  name: z.string().max(30),
  description: z.string().nullable(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

export type Project = z.infer<typeof projectSchema>;
