import { z } from 'zod';
import type { ValidatedRequest } from 'express-zod-safe';

export const projectFileParamsSchema = z.object({
  id: z.uuid(),
});

export const projectFileBodySchema = z.object({});

export type ProjectFileRequest = ValidatedRequest<{
  params: typeof projectFileParamsSchema;
  body: typeof projectFileBodySchema;
}>;
