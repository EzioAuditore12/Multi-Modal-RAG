import { z } from 'zod';

import { projectSchema } from '@/db/models/project.model';

export const createProjectResponseSchema = projectSchema;

export type CreateProjectResponse = z.infer<typeof createProjectResponseSchema>;
