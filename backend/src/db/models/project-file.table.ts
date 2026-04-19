import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  bigint,
  text,
} from 'drizzle-orm/pg-core';
import {
  createInsertSchema,
  createUpdateSchema,
  createSelectSchema,
} from 'drizzle-zod';
import { z } from 'zod';

import { projectTable } from './project.model';

import { SnowFlakeId } from '@/utils/snowflake';

export const PROJECT_FILE_TABLE_NAME = 'project_file';

export const projectFileTable = pgTable(PROJECT_FILE_TABLE_NAME, {
  id: bigint('id', { mode: 'bigint' })
    .primaryKey()
    .$defaultFn(() => new SnowFlakeId(1).generate()),
  projectId: uuid('project_id')
    .references(() => projectTable.id, { onDelete: 'cascade' })
    .notNull(),
  url: text('url').notNull(),
  filename: varchar('filename', { length: 255 }),
  uploadedAt: timestamp('uploaded_at').defaultNow().notNull(),
});

export const projectFileSchema = createSelectSchema(projectFileTable);
export const projectFileInsertSchema = createInsertSchema(projectFileTable);
export const projectFileUpdateSchema = createUpdateSchema(projectFileTable);

export type ProjectFile = z.infer<typeof projectFileSchema>;
export type ProjectFileInsert = z.infer<typeof projectFileInsertSchema>;
export type ProjectFileUpdate = z.infer<typeof projectFileUpdateSchema>;
