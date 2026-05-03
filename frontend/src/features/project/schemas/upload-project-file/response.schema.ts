import { z } from 'zod';
import { projectFileSchema } from '../project-file.schema';

export const uploadProjectFileResponseSchema = projectFileSchema;

export type UploadProjectFileResponse = z.infer<typeof uploadProjectFileResponseSchema>;
