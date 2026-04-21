import { pgTable, uuid, timestamp, text } from 'drizzle-orm/pg-core';
import {
  createInsertSchema,
  createUpdateSchema,
  createSelectSchema,
} from 'drizzle-zod';
import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

import { projectTable } from './project.model';

export const PROJECT_FILE_TABLE_NAME = 'project_file';

export const projectFileTable = pgTable(PROJECT_FILE_TABLE_NAME, {
  id: uuid('id')
    .primaryKey()
    .references(() => projectTable.id, { onDelete: 'cascade' })
    .notNull(),
  url: text('url').notNull(),
  fileName: text('file_name'),
  uploadedAt: timestamp('uploaded_at').defaultNow().notNull(),
});

export const projectFileSchema = createSelectSchema(projectFileTable, {
  id: z.uuid(),
  url: z.url(),
  fileName: z.string().nullable(),
  uploadedAt: z.date(),
});
export const projectFileInsertSchema = createInsertSchema(projectFileTable);
export const projectFileUpdateSchema = createUpdateSchema(projectFileTable);

export type ProjectFile = z.infer<typeof projectFileSchema>;
export type ProjectFileInsert = z.infer<typeof projectFileInsertSchema>;
export type ProjectFileUpdate = z.infer<typeof projectFileUpdateSchema>;
