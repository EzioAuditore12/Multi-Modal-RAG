import { z } from 'zod';
import type { ValidatedRequest } from 'express-zod-safe';

import { projectInsertSchema } from '@/db/models/project.model';

export const createProjectSchema = projectInsertSchema.omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
});

export type CreateProject = z.infer<typeof createProjectSchema>;

export type CreateProjectRequest = ValidatedRequest<{
  body: typeof createProjectSchema;
}>;
