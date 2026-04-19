import { index, pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import {
  createSelectSchema,
  createInsertSchema,
  createUpdateSchema,
} from 'drizzle-zod';
import { z } from 'zod';

import { userTable } from './user.model';

const PROJECT_TABLE_NAME = 'project';

export const projectTable = pgTable(
  PROJECT_TABLE_NAME,
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .references(() => userTable.id, { onDelete: 'cascade' })
      .notNull(),
    name: varchar('name', { length: 60 }).notNull(),
    description: varchar('description', { length: 240 }),
    createdAt: timestamp().defaultNow(),
    updatedAt: timestamp().$onUpdateFn(() => new Date()),
  },
  (t) => [index('project_user_id_idx').on(t.userId)],
);

export const projectSchema = createSelectSchema(projectTable);
export const projectInsertSchema = createInsertSchema(projectTable);
export const projectUpdateSchema = createUpdateSchema(projectTable);

export type Project = z.infer<typeof projectSchema>;
export type ProjectInsert = z.infer<typeof projectInsertSchema>;
export type ProjectUpdate = z.infer<typeof projectUpdateSchema>;
