import { z } from 'zod';
import type { ValidatedRequest } from 'express-zod-safe';

export const projectFileEmbeddingParamsSchema = z.object({
  id: z.uuid(),
});

export type ProjectFileEmbeddingRequest = ValidatedRequest<{
  params: typeof projectFileEmbeddingParamsSchema;
}>;
