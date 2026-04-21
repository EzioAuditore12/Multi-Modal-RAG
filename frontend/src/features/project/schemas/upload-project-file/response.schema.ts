import { z } from 'zod';

export const uploadProjectFileResponseSchema = z.object({
  id: z.uuid(),
  url: z.url(),
  fileName: z.string().nullable(),
  uploadedAt: z.iso.datetime(),
});

export type UploadProjectFileResponse = z.infer<typeof uploadProjectFileResponseSchema>;
