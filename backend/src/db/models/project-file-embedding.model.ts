import {
  pgTable,
  bigint,
  vector,
  text,
  index,
  timestamp,
} from 'drizzle-orm/pg-core';
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from 'drizzle-zod';
import { z } from 'zod';

import { projectFileTable } from './project-file.table';

export const PROJECT_FILE_EMBEDDING_TABLE_NAME = 'project_file_embedding';

export const projectFileEmbeddingTable = pgTable(
  PROJECT_FILE_EMBEDDING_TABLE_NAME,
  {
    id: bigint('id', { mode: 'bigint' })
      .primaryKey()
      .references(() => projectFileTable.id, { onDelete: 'cascade' }),
    embedding: vector('embedding', { dimensions: 1536 }).notNull(),
    content: text('content').notNull(),
    metaData: text('meta_data'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').$onUpdateFn(() => new Date()),
  },
  (t) => [
    index('embedding_index').using('hnsw', t.embedding.op('vector_cosine_ops')),
  ],
);

export const projectFileEmbeddingSchema = createSelectSchema(
  projectFileEmbeddingTable,
);
export const projectFileEmbeddingInsertSchema = createInsertSchema(
  projectFileEmbeddingTable,
);
export const projectFileEmbeddingUpdateSchema = createUpdateSchema(
  projectFileEmbeddingTable,
);

export type ProjectFileEmbedding = z.infer<typeof projectFileEmbeddingSchema>;
export type ProjectFileEmbeddingInsert = z.infer<
  typeof projectFileEmbeddingInsertSchema
>;
export type ProjectFileEmbeddingUpdate = z.infer<
  typeof projectFileEmbeddingUpdateSchema
>;
