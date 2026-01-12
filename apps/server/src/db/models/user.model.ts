import { pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const userTable = pgTable("users", {
  id: uuid().primaryKey().unique().defaultRandom(),
  name: varchar({ length: 50 }).notNull(),
  email: varchar({ length: 240 }).unique().notNull(),
  password: text().notNull(),
  avatar: text(),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const insertUserTableSchema = createInsertSchema(userTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const selectUserTableSchema = createSelectSchema(userTable).omit({
  password: true,
});

export type InsertUser = z.infer<typeof insertUserTableSchema>;
export type SelectUser = z.infer<typeof selectUserTableSchema>;
