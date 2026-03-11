import { z } from "zod";
import { pgTable, serial, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";

extendZodWithOpenApi(z);

export const BLACKLIST_REFRESH_TOKEN_TABLE_NAME = "blacklist_refresh_token";

export const blackListedRefreshTokenTable = pgTable(
  BLACKLIST_REFRESH_TOKEN_TABLE_NAME,
  {
    id: serial("id").primaryKey(),
    refreshToken: text("refresh_token").notNull(),
    createdAt: timestamp("created_at").notNull(),
    expiredAt: timestamp("expired_at").notNull(),
  },
);

export const selectBlackListRefreshTokenSchema = createSelectSchema(
  blackListedRefreshTokenTable,
);
export const insertBlackListRefreshTokenSchema = createInsertSchema(
  blackListedRefreshTokenTable,
);

export type BlackListRefreshToken = z.infer<
  typeof selectBlackListRefreshTokenSchema
>;
export type InsertBlackListRefreshToken = z.infer<
  typeof insertBlackListRefreshTokenSchema
>;
