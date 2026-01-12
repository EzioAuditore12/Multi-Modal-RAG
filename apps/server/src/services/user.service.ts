import { db } from "@/db";

import { type InsertUser, userTable } from "@/db/models/user.model";
import { eq } from "drizzle-orm";

export class UserService {
  async create(insertUser: InsertUser) {
    const [createdUser] = await db
      .insert(userTable)
      .values(insertUser)
      .returning();

    return createdUser;
  }

  async findUserByEmail(email: string) {
    const result = await db
      .select()
      .from(userTable)
      .where(eq(userTable.email, email))
      .limit(1);

    return result[0] || null;
  }
}
