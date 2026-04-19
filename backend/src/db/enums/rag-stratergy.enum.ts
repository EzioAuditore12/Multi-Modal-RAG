import { pgEnum } from 'drizzle-orm/pg-core';

export const ragStrategyEnum = pgEnum('rag_strategy', [
  'basic',
  'hybrid',
  'multi-query-vector',
  'multi-query-hybrid',
]);
