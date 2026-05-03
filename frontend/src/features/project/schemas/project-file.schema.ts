import { z } from 'zod';

export const projectFileSchema = z.object({
  id: z.uuid(),
  url: z.url(),
  fileName: z.string().nullable(),
  uploadedAt: z.iso.datetime(),
});

export type ProjectFile = z.infer<typeof projectFileSchema>;
