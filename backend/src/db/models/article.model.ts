import {
  bigint,
  pgTable,
  text,
  uuid,
  varchar,
  timestamp,
  foreignKey,
  index,
} from 'drizzle-orm/pg-core';
import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from 'drizzle-zod';

extendZodWithOpenApi(z);

import { SnowFlakeId } from '@/utils/snowflake';
import { userTable } from './user.model';

export const ARTICLE_TABLE_NAME = 'article';
export const ARTICLE_VERSION_TABLE_NAME = 'article_version';
export const ARTICLE_CHAT_TABLE_NAME = 'article_chat';

// 1. Core Article Table
// Represents the main entity. We store the *latest* content here for easy and fast retrieval.
export const articleTable = pgTable(
  ARTICLE_TABLE_NAME,
  {
    id: bigint('id', { mode: 'bigint' })
      .primaryKey()
      .$defaultFn(() => new SnowFlakeId(1).generate()),
    userId: uuid('user_id').notNull(),
    title: varchar('title', { length: 255 }).notNull(),
    currentContent: text('current_content').notNull(), // Always holds the latest iteration
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (t) => [
    foreignKey({
      columns: [t.userId],
      foreignColumns: [userTable.id],
      name: 'article_user_fk',
    }),
    index('article_user_id_idx').on(t.userId),
  ],
);

// 2. Article Versions Table
// Stores every historical snapshot of the article's content.
export const articleVersionTable = pgTable(
  ARTICLE_VERSION_TABLE_NAME,
  {
    id: bigint('id', { mode: 'bigint' })
      .primaryKey()
      .$defaultFn(() => new SnowFlakeId(1).generate()),
    articleId: bigint('article_id', { mode: 'bigint' }).notNull(),

    // The content at this specific point in time
    content: text('content').notNull(),

    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (t) => [
    foreignKey({
      columns: [t.articleId],
      foreignColumns: [articleTable.id],
      name: 'version_article_fk',
    }),
    index('version_article_id_idx').on(t.articleId),
  ],
);

// 3. Article Chat Table
// Stores the conversational history (user prompts and AI responses).
export const articleChatTable = pgTable(
  ARTICLE_CHAT_TABLE_NAME,
  {
    id: bigint('id', { mode: 'bigint' })
      .primaryKey()
      .$defaultFn(() => new SnowFlakeId(1).generate()),
    articleId: bigint('article_id', { mode: 'bigint' }).notNull(),

    // Optional: link the prompt to the specific article version it generated
    resultingVersionId: bigint('resulting_version_id', { mode: 'bigint' }),

    role: varchar('role', { length: 20 }).notNull(), // e.g., 'user', 'assistant', 'system'
    content: text('content').notNull(), // The prompt text or AI message

    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (t) => [
    foreignKey({
      columns: [t.articleId],
      foreignColumns: [articleTable.id],
      name: 'chat_article_fk',
    }),
    foreignKey({
      columns: [t.resultingVersionId],
      foreignColumns: [articleVersionTable.id],
      name: 'chat_version_fk',
    }),
    index('chat_article_id_idx').on(t.articleId),
  ],
);

// Article
export const selectArticleSchema = createSelectSchema(articleTable);
export const insertArticleSchema = createInsertSchema(articleTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export const updateArticleSchema = createUpdateSchema(articleTable);

// Article Version
export const selectArticleVersionSchema =
  createSelectSchema(articleVersionTable);
export const insertArticleVersionSchema = createInsertSchema(
  articleVersionTable,
).omit({
  id: true,
  createdAt: true,
});
export const updateArticleVersionSchema =
  createUpdateSchema(articleVersionTable);

// Article Chat
export const selectArticleChatSchema = createSelectSchema(articleChatTable);
export const insertArticleChatSchema = createInsertSchema(
  articleChatTable,
).omit({
  id: true,
  createdAt: true,
});
export const updateArticleChatSchema = createUpdateSchema(articleChatTable);

// Types (optional, for TypeScript)
export type Article = z.infer<typeof selectArticleSchema>;
export type InsertArticle = z.infer<typeof insertArticleSchema>;
export type UpdateArticle = z.infer<typeof updateArticleSchema>;

export type ArticleVersion = z.infer<typeof selectArticleVersionSchema>;
export type InsertArticleVersion = z.infer<typeof insertArticleVersionSchema>;
export type UpdateArticleVersion = z.infer<typeof updateArticleVersionSchema>;

export type ArticleChat = z.infer<typeof selectArticleChatSchema>;
export type InsertArticleChat = z.infer<typeof insertArticleChatSchema>;
export type UpdateArticleChat = z.infer<typeof updateArticleChatSchema>;
