import { z } from 'zod';

export const createNewProjectParamSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
});

export type CreateNewProjectParam = z.infer<typeof createNewProjectParamSchema>;
