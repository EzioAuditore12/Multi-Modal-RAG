import { z } from 'zod';
import { projectFileSchema } from '@/db/models/project-file.table';

export const uploadProjectFileResponseSchema = projectFileSchema.extend({
  id: z.coerce.string().openapi({ example: '144123342' }),
});

export type UploadProjectFileResponse = z.infer<
  typeof uploadProjectFileResponseSchema
>;
