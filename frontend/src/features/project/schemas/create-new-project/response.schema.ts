import { z } from 'zod';

import { projectSchema } from '@/features/home/schemas/project.schema';

export const createNewProjectResponseSchema = projectSchema;

export type CreateNewProjectResponse = z.infer<typeof createNewProjectResponseSchema>;
