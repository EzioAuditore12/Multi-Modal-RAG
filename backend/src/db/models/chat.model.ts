import {
  bigint,
  index,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import {
  createSelectSchema,
  createInsertSchema,
  createUpdateSchema,
} from 'drizzle-zod';
import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

import { projectTable } from './project.model';

import { SnowFlakeId } from '@/utils/snowflake';

const CHAT_TABLE_NAME = 'chat';

export const chatTable = pgTable(
  CHAT_TABLE_NAME,
  {
    id: bigint('id', { mode: 'bigint' })
      .primaryKey()
      .$defaultFn(() => new SnowFlakeId(1).generate()),
    projectId: uuid('project_id')
      .references(() => projectTable.id, { onDelete: 'cascade' })
      .notNull(),
    title: varchar('title', { length: 100 }).notNull(),
    createdAt: timestamp().defaultNow().notNull(),
    updatedAt: timestamp()
      .$onUpdateFn(() => new Date())
      .notNull(),
  },
  (t) => [index('chat_project_id_idx').on(t.projectId)],
);

export const chatSchema = createSelectSchema(chatTable, {
  id: z.bigint(),
  projectId: z.uuid(),
  title: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export const chatInsertSchema = createInsertSchema(chatTable);
export const chatUpdateSchema = createUpdateSchema(chatTable);

export type Chat = z.infer<typeof chatSchema>;
export type ChatInsert = z.infer<typeof chatInsertSchema>;
export type ChatUpdate = z.infer<typeof chatUpdateSchema>;
