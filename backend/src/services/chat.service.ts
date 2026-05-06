import { and, desc, eq, gt, ilike } from 'drizzle-orm';

import { db } from '@/db';
import { Chat, ChatInsert, chatTable } from '@/db/models/chat.model';
import type { GetProjectChats } from '@/schemas/chat/get-project-chats';

export class ChatService {
  private readonly database = db;
  private readonly table = chatTable;

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

  public async findByIdAndProjectId(
    projectId: string,
    id: bigint,
  ): Promise<Chat[]> {
    return await this.database
      .select()
      .from(this.table)
      .where(and(eq(this.table.id, id), eq(this.table.projectId, projectId)));
  }

  public async findById(id: bigint): Promise<Chat | undefined> {
    return await this.database
      .select()
      .from(this.table)
      .where(eq(this.table.id, id))
      .then((res) => res[0] ?? undefined);
  }

  public async delete(id: bigint): Promise<void> {
    await this.database.delete(this.table).where(eq(this.table.id, id));
  }
}

export const chatService = new ChatService();
