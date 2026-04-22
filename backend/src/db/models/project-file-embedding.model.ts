import {
  pgTable,
  bigint,
  vector,
  text,
  index,
  timestamp,
  jsonb,
  uuid,
} from 'drizzle-orm/pg-core';
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from 'drizzle-zod';
import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

import { projectFileTable } from './project-file.table';
import { SnowFlakeId } from '@/utils/snowflake';

export const PROJECT_FILE_EMBEDDING_TABLE_NAME = 'project_file_embedding';

export const projectFileEmbeddingTable = pgTable(
  PROJECT_FILE_EMBEDDING_TABLE_NAME,
  {
    id: bigint('id', { mode: 'bigint' })
      .primaryKey()
      .$defaultFn(() => new SnowFlakeId(1).generate()),
    projectFileId: uuid('project_file_id').references(
      () => projectFileTable.id,
      { onDelete: 'cascade' },
    ),
    embedding: vector('embedding', { dimensions: 1536 }).notNull(),
    content: text('content').notNull(),
    metaData: jsonb('meta_data'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .$onUpdateFn(() => new Date())
      .notNull(),
  },
  (t) => [
    index('project_file_embedding_project_file_id_idx').on(t.projectFileId),
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
