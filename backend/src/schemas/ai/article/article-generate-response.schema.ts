import { z } from 'zod';

export const articleGeneraterResponseSchema = z.object({
  topic: z.string(),
  content: z.string(),
});

export type ArticleGeneratorResponse = z.infer<
  typeof articleGeneraterResponseSchema
>;
