import { pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import {
  createSelectSchema,
  createInsertSchema,
  createUpdateSchema,
} from 'drizzle-zod';
import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

import { projectTable } from './project.model';

import { ragStrategyEnum } from '../enums/rag-stratergy.enum';

export const PROJECT_SETTINGS_TABLE_NAME = 'project_settings';

export const projectSettingTable = pgTable(PROJECT_SETTINGS_TABLE_NAME, {
  id: uuid('id')
    .primaryKey()
    .references(() => projectTable.id, { onDelete: 'cascade' }),
  embeddingModel: varchar('embedding_model', { length: 100 })
    .default('gemini-embedding-001')
    .notNull(),
  ragStrategy: ragStrategyEnum('rag_stratergy').default('basic').notNull(),
  reRankingModel: varchar('reranking_model', { length: 100 })
    .default('not defined')
    .notNull(),
  updatedAt: timestamp()
    .$onUpdateFn(() => new Date())
    .notNull(),
});

export const projectSettingSchema = createSelectSchema(projectSettingTable, {
  id: z.uuid(),
  updatedAt: z.date(),
});
export const projectSettingInsertSchema =
  createInsertSchema(projectSettingTable);
export const projectSettingUpdateSchema = createUpdateSchema(
  projectSettingTable,
).omit({ updatedAt: true });

export type ProjectSetting = z.infer<typeof projectSettingSchema>;
export type ProjectSettingInsert = z.infer<typeof projectSettingInsertSchema>;
export type ProjectSettingUpdate = z.infer<typeof projectSettingUpdateSchema>;
