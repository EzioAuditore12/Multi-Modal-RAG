import { z } from 'zod';

import { projectSchema } from '../project.schema';

export const getAllProjectsResponseSchema = projectSchema.array();

export type GetAllProjectsResponse = z.infer<typeof getAllProjectsResponseSchema>;
