import { pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import z from 'zod';

// Tables

export const userTable = pgTable('User', {
  id: uuid().primaryKey().unique().defaultRandom(),
  name: varchar({ length: 50 }).notNull(),
  email: varchar({ length: 50 }).unique().notNull(),
  password: text().notNull(),
  profilePicture: text(),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp()
    .$onUpdate(() => new Date())
    .notNull(),
});

// Schema Configurations

extendZodWithOpenApi(z);

const userSchema = z.object({
  id: z.uuid().openapi({ description: 'User ID' }),
  name: z.string().max(50).openapi({ description: 'User name' }),
  email: z.email().max(240).openapi({ description: 'User email' }),
  password: z.string().max(50).openapi({ description: 'User password' }),
  profilePicture: z
    .string()
    .optional()
    .nullable()
    .openapi({ description: 'User image' }),
  createdAt: z
    .date()
    .openapi({ description: 'The date in which user was created' }),
  updatedAt: z
    .date()
    .openapi({ description: 'The date in which user updated details' }),
});

export const userSelectSchema = userSchema.omit({
  password: true,
  updatedAt: true,
});

export const userCreateSchema = userSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const userLoginSchema = userCreateSchema.pick({
  email: true,
  password: true,
});

export type userSelectResponse = z.infer<typeof userSelectSchema>;
export type userCreateRequestBody = z.infer<typeof userCreateSchema>;
