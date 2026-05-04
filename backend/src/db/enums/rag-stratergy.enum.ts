import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { pgEnum } from 'drizzle-orm/pg-core';
import { createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

extendZodWithOpenApi(z);

export const ragStrategyEnum = pgEnum('rag_strategy', [
  'basic',
  'hybrid',
  'multi-query-vector',
  'multi-query-hybrid',
]);

export const ragStrategySchema = createSelectSchema(ragStrategyEnum);

export type RagStrategy = z.infer<typeof ragStrategySchema>;
