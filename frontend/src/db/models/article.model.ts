import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export const ARTICLE_TABLE_NAME = 'article';

export const articleTable = sqliteTable(ARTICLE_TABLE_NAME, {
  id: text('id').primaryKey(),
  title: text('title', { length: 255 }).notNull(),
  currentContent: text('current_content').notNull(),
  createdAt: integer('created_at')
    .$defaultFn(() => Date.now())
    .notNull(),
  updatedAt: integer('updated_at')
    .$onUpdate(() => Date.now())
    .notNull(),
});

export const selectArticleSchema = createSelectSchema(articleTable);

export const insertArticleSchema = createInsertSchema(articleTable);

export type Article = z.infer<typeof selectArticleSchema>;
export type InsertArticle = z.infer<typeof insertArticleSchema>;
