import { z } from 'zod';

export const getAllProjectsParamSchema = z.object({
  cursor: z.string().optional(),
  pageSize: z.coerce.number().min(1).default(10),
  search: z.string().max(30).optional(),
});

export type GetAllProjectsParam = z.infer<typeof getAllProjectsParamSchema>;
