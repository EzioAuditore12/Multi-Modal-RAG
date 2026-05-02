import { and, desc, eq, lt } from 'drizzle-orm';

import { db } from '@/db';
import {
  Message,
  MessageInsert,
  messageTable,
} from '@/db/models/message.model';
import { GetChatMessages } from '@/schemas/messages/get-messages/request.schema';

export class MessageService {
  private readonly database = db;
  private readonly table = messageTable;

  public async create(data: MessageInsert): Promise<Message> {
    return await this.database
      .insert(this.table)
      .values(data)
      .returning()
      .then((res) => res[0]);
  }

  public async getAll(data: GetChatMessages): Promise<Message[]> {
    const { pageSize, cursor, chatId } = data;

    const conditions = [eq(this.table.chatId, chatId)];

    if (cursor) conditions.push(lt(this.table.id, cursor));

    return await this.database
      .select()
      .from(this.table)
      .where(and(...conditions))
      .orderBy(desc(this.table.id), desc(this.table.updatedAt))
      .limit(pageSize);
  }
}

export const messageService = new MessageService();
