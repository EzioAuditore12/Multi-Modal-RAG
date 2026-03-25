import type { ValidatedRequest } from 'express-zod-safe';
import { z } from 'zod';

import { articleInputSchema } from '@/ai/tools/article';

export const articleGenerateSchema = articleInputSchema;

export type ArticleGenerate = z.infer<typeof articleGenerateSchema>;

export type ArticleGenerateRequest = ValidatedRequest<{
  body: typeof articleGenerateSchema;
}>;
