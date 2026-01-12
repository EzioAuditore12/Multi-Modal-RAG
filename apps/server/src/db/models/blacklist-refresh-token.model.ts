import { pgTable, text, timestamp, serial } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const blackListedRefreshTokenTable = pgTable(
  "blacklisted_refresh_token",
  {
    id: serial().primaryKey(),
    refreshToken: text().notNull(),
    createdAt: timestamp().notNull(),
    expiredAt: timestamp().notNull(),
  }
);

export const insertBlackListedRefreshTokenSchema = createInsertSchema(
  blackListedRefreshTokenTable
).omit({ id: true });

export type InsertBlackListedRefreshToken = z.infer<
  typeof insertBlackListedRefreshTokenSchema
>;
