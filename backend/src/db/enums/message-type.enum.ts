import { pgEnum } from 'drizzle-orm/pg-core';

export const messageTypeEnum = pgEnum('message_type', ['human', 'ai']);
