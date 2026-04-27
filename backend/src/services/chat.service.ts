import { and, desc, eq, gt, ilike } from 'drizzle-orm';

import { db } from '@/db';
import { Chat, ChatInsert, chatTable } from '@/db/models/chat.model';
import {
  Message,
  MessageInsert,
  messageTable,
} from '@/db/models/message.model';
import { GetProjectChats } from '@/schemas/chat/get-project-chats';

export class ChatService {
  private readonly database = db;
  private readonly table = chatTable;
  private readonly messageTable = messageTable;

  public async create(data: ChatInsert): Promise<Chat> {
    return await this.database
      .insert(this.table)
      .values(data)
      .returning()
      .then((res) => res[0]);
  }

  public async getAll(data: GetProjectChats): Promise<Chat[]> {
    const { pageSize, cursor, search, projectId } = data;

    const conditions = [eq(this.table.projectId, projectId)];

    if (cursor) conditions.push(gt(this.table.id, cursor));

    if (search) conditions.push(ilike(this.table.title, `%${search}%`));

    return await this.database
      .select()
      .from(this.table)
      .where(and(...conditions))
      .orderBy(desc(this.table.id), this.table.updatedAt)
      .limit(pageSize);
  }

  public async createMessage(data: MessageInsert): Promise<Message> {
    return await this.database
      .insert(this.messageTable)
      .values(data)
      .returning()
      .then((res) => res[0]);
  }

  public async findById(projectId: string, id: bigint) {
    return await this.database
      .select()
      .from(this.table)
      .where(and(eq(this.table.id, id), eq(this.table.projectId, projectId)));
  }
}

export const chatService = new ChatService();
