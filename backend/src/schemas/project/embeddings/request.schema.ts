import { z } from 'zod';
import type { ValidatedRequest } from 'express-zod-safe';

export const projectFileEmbeddingParamsSchema = z.object({
  id: z.coerce.bigint().openapi(' Enter bigint in string format'),
});

export const projectFileEmbeddingBodySchema = z.object({
  projectId: z.uuid(),
});

export type ProjectFileEmbeddingRequest = ValidatedRequest<{
  params: typeof projectFileEmbeddingParamsSchema;
  body: typeof projectFileEmbeddingBodySchema;
}>;
