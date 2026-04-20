import { bigint, index, pgTable, timestamp } from 'drizzle-orm/pg-core';
import {
  createSelectSchema,
  createInsertSchema,
  createUpdateSchema,
} from 'drizzle-zod';
import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

import { chatTable } from './chat.model';
import { messageTypeEnum } from '../enums/message-type.enum';

import { SnowFlakeId } from '@/utils/snowflake';

const MESSAGE_TABLE_NAME = 'message';

export const messageTable = pgTable(
  MESSAGE_TABLE_NAME,
  {
    id: bigint('id', { mode: 'bigint' })
      .primaryKey()
      .$defaultFn(() => new SnowFlakeId(1).generate()),
    chatId: bigint('chat_id', { mode: 'bigint' })
      .references(() => chatTable.id, { onDelete: 'cascade' })
      .notNull(),
    type: messageTypeEnum('type').notNull(),
    createdAt: timestamp().defaultNow().notNull(),
    updatedAt: timestamp()
      .$onUpdateFn(() => new Date())
      .notNull(),
  },
  (t) => [index('message_chat_id_idx').on(t.chatId)],
);

export const messageSchema = createSelectSchema(messageTable);
export const messageInsertSchema = createInsertSchema(messageTable);
export const messageUpdateSchema = createUpdateSchema(messageTable);

export type Message = z.infer<typeof messageSchema>;
export type MessageInsert = z.infer<typeof messageInsertSchema>;
export type MessageUpdate = z.infer<typeof messageUpdateSchema>;
