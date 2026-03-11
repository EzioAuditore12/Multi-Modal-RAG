import { pgTable, uuid, varchar, text, timestamp } from "drizzle-orm/pg-core";
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";
import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";

extendZodWithOpenApi(z);

export const USER_TABLE_NAME = "user";

export const userTable = pgTable(USER_TABLE_NAME, {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 50 }).notNull(),
  email: varchar("email", { length: 240 }).unique().notNull(),
  password: text("password").notNull(),
  avatar: text("avatar"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .$onUpdate(() => new Date())
    .notNull(),
});

export const selectUserSchema = createSelectSchema(userTable, {
  email: z.email(),
});

export const insertUserSchema = createInsertSchema(userTable, {
  email: z.email(),
  password: z.string().max(16),
}).omit({ id: true, createdAt: true, updatedAt: true });

export const updateUserSchema = createUpdateSchema(userTable);
export const publicUserSchema = selectUserSchema.omit({ password: true });

export const getUserSchema = z.object({
  params: z.object({ id: z.uuid() }),
});

export type User = z.infer<typeof selectUserSchema>;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type UpdateUser = z.infer<typeof updateUserSchema>;
export type PublicUser = z.infer<typeof publicUserSchema>;
