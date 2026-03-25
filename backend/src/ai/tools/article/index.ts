import { tool } from '@langchain/core/tools';
import { z } from 'zod';

export const articleInputSchema = z.object({
  topic: z.string().describe('The topic of the article'),
  length: z.coerce
    .number()
    .max(1500)
    .default(500)
    .optional()
    .describe('Desired length in words'),
  style: z.string().optional().describe('Writing style'),
});

export type ArticleInput = z.infer<typeof articleInputSchema>;

const generateArticle = tool(
  ({ topic, length, style }: ArticleInput) => {
    return `Generated article about "${topic}"${length ? ` (${length} words)` : ''}${style ? ` in ${style} style` : ''}.`;
  },
  {
    name: 'generateArticle',
    description:
      'Generates an article based on the given topic, length, and style.',
    schema: articleInputSchema,
  },
);

export const articleTools = [generateArticle];
