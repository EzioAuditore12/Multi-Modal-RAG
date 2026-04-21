import { z } from 'zod';
import type { ValidatedRequest } from 'express-zod-safe';

import { paginationSchema } from '../pagination.schema';

export const getAllProjectsSchema = paginationSchema;

export type GetAllProjects = z.infer<typeof getAllProjectsSchema>;

export type GetAllProjectsRequest = ValidatedRequest<{
  query: typeof getAllProjectsSchema;
}>;
