import { StatusCodes } from "http-status-codes";
import { eq } from "drizzle-orm";

import { ServiceResponse } from "@/utils/service-response";
import { logger } from "@/utils/logger";

import { db } from "@/db";
import { InsertUser, type User, userTable } from "@/db/models/user.model";

export class UserService {
  private readonly database = db;
  private readonly table = userTable;

  async create(insertUser: InsertUser): Promise<User> {
    return await this.database
      .insert(this.table)
      .values(insertUser)
      .returning()
      .then((res) => res[0]);
  }

  public async findOne(id: string): Promise<User | null> {
    return await this.database
      .select()
      .from(this.table)
      .where(eq(this.table.id, id))
      .then((res) => (res.length > 0 ? res[0] : null));
  }

  public async findByEmail(email: string): Promise<User | null> {
    return await this.database
      .select()
      .from(this.table)
      .where(eq(this.table.email, email))
      .then((res) => (res.length > 0 ? res[0] : null));
  }

  // Retrieves all users from the database
  async findAll(): Promise<ServiceResponse<User[] | null>> {
    try {
      const users = await this.database.select().from(this.table);
      if (!users || users.length === 0) {
        return ServiceResponse.failure(
          "No Users found",
          null,
          StatusCodes.NOT_FOUND,
        );
      }
      return ServiceResponse.success<User[]>("Users found", users);
    } catch (ex) {
      const errorMessage = `Error finding all users: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while retrieving users.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Retrieves a single user by their ID
  async findById(id: string): Promise<ServiceResponse<User | null>> {
    try {
      const users = await this.database
        .select()
        .from(this.table)
        .where(eq(this.table.id, id))
        .limit(1);
      const user = users[0] || null;
      if (!user) {
        return ServiceResponse.failure(
          "User not found",
          null,
          StatusCodes.NOT_FOUND,
        );
      }
      return ServiceResponse.success<User>("User found", user);
    } catch (ex) {
      const errorMessage = `Error finding user with id ${id}: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while finding user.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

export const userService = new UserService();
