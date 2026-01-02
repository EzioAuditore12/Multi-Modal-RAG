import { z } from 'zod';
import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import validator from 'validator';
import { userTable } from './user.model';

export const blackListedRefreshTokenTable = pgTable(
  'Blacklisted-refresh-token-table',
  {
    id: uuid().primaryKey().defaultRandom().notNull(),
    userId: uuid()
      .notNull()
      .references(() => userTable.id),
    refresh_token: text().notNull(),
    createdAt: timestamp().notNull(),
    expiredAt: timestamp().notNull(),
  },
);

const blackListRefreshTokenSchema = z.object({
  id: z.uuid(),
  userId: z.uuid(),
  refresh_token: z.string(),
  createdAt: z.date(),
  expiredAt: z.date(),
});

export const createInsertBlackListTokenSchema = blackListRefreshTokenSchema
  .omit({ id: true })
  .refine((val) => validator.isJWT(val.refresh_token), {
    message: 'Invalid jwt token',
  });
