import { and, eq } from 'drizzle-orm';

import { db } from '@/db';
import { Chat, ChatInsert, chatTable } from '@/db/models/chat.model';
import {
  Message,
  MessageInsert,
  messageTable,
} from '@/db/models/message.model';
import { projectService } from './project.service';

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
