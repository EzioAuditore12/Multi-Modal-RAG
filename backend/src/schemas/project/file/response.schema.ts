import { z } from 'zod';
import { projectFileSchema } from '@/db/models/project-file.table';

export const uploadProjectFileResponseSchema = projectFileSchema;

export type UploadProjectFileResponse = z.infer<
  typeof uploadProjectFileResponseSchema
>;
