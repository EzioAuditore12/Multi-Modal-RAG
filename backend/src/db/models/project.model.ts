import { index, pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import {
  createSelectSchema,
  createInsertSchema,
  createUpdateSchema,
} from 'drizzle-zod';
import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

import { userTable } from './user.model';

const PROJECT_TABLE_NAME = 'project';

export const projectTable = pgTable(
  PROJECT_TABLE_NAME,
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .references(() => userTable.id, { onDelete: 'cascade' })
      .notNull(),
    name: varchar('name', { length: 30 }).notNull(),
    description: varchar('description', { length: 100 }),
    createdAt: timestamp().defaultNow().notNull(),
    updatedAt: timestamp()
      .$onUpdateFn(() => new Date())
      .notNull(),
  },
  (t) => [index('project_user_id_idx').on(t.userId)],
);

export const projectSchema = createSelectSchema(projectTable, {
  id: z.uuid(),
  userId: z.uuid(),
  description: z.string().length(100).nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export const projectInsertSchema = createInsertSchema(projectTable, {
  name: z.string().nonempty().max(30),
});
export const projectUpdateSchema = createUpdateSchema(projectTable);

export type Project = z.infer<typeof projectSchema>;
export type ProjectInsert = z.infer<typeof projectInsertSchema>;
export type ProjectUpdate = z.infer<typeof projectUpdateSchema>;
