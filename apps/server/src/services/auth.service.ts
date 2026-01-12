import httpError from "http-errors";

import { db } from "@/db";
import { blackListedRefreshTokenTable } from "@/db/models/blacklist-refresh-token.model";

import { UserService } from "./user.service";
import {
  generateHashedPassword,
  validatePassword,
} from "@/utils/crypto-password";
import { generateAuthToken, parseRefreshToken } from "@/utils/jwt";

import { LoginRequestBody } from "@/validators/auth/login/login-request-body.schema";
import { loginResponseBodySchema } from "@/validators/auth/login/login-response-body.schema";

import { registerResponseBodySchema } from "@/validators/auth/register/register-response-body.schema";
import { RegisterRequestBody } from "@/validators/auth/register/register-request-body.schema";
import { eq } from "drizzle-orm";

const userService = new UserService();

export class AuthService {
  async register(registerRequestBody: RegisterRequestBody) {
    const { email, name, password } = registerRequestBody;

    const existingUser = await userService.findUserByEmail(email);

    if (existingUser)
      throw new httpError.Conflict(
        "User with this email is already registered"
      );

    const hashedPassword = await generateHashedPassword(password);

    const createdUser = await userService.create({
      name: name,
      email: email,
      password: hashedPassword,
    });

    const tokens = await this.generateTokens(createdUser.id);

    return registerResponseBodySchema.parse({
      user: createdUser,
      tokens,
    });
  }

  async loginUser(loginRequestBody: LoginRequestBody) {
    const user = await this.validateUser(loginRequestBody);

    const tokens = await this.generateTokens(user.id);

    return loginResponseBodySchema.parse({
      user,
      tokens,
    });
  }

  async validateUser(loginRequestBody: LoginRequestBody) {
    const { email, password } = loginRequestBody;

    const existingUser = await userService.findUserByEmail(email);

    if (!existingUser)
      throw new httpError.NotFound(
        "User with this email is not registered with us"
      );

    const isPasswordValid = validatePassword(password, existingUser.password);

    if (!isPasswordValid)
      throw new httpError.Unauthorized(
        "Either entered email or password is wrong"
      );

    return existingUser;
  }

  async refreshTokens(refreshToken: string) {
    const isExistinBlackListedToken =
      await this.findBlackListedRefreshToken(refreshToken);

    if (isExistinBlackListedToken)
      throw new httpError.Unauthorized("Given refresh token is blacklisted");

    const userId = await this.insertBlacklistedRefreshToken(refreshToken);

    const tokens = await this.generateTokens(userId as string);

    return tokens;
  }

  async insertBlacklistedRefreshToken(refreshToken: string) {
    const parsedRefreshToken = await parseRefreshToken(refreshToken);

    if (!parseRefreshToken)
      throw new httpError.Unauthorized(
        "Given refresh token is invalid or expired"
      );

    if (parsedRefreshToken !== null) {
      await db.insert(blackListedRefreshTokenTable).values({
        refreshToken: refreshToken,
        createdAt: new Date(parsedRefreshToken.iat),
        expiredAt: new Date(parsedRefreshToken.exp),
      });
    }

    return parsedRefreshToken?.id;
  }

  async findBlackListedRefreshToken(refreshToken: string) {
    const result = await db
      .select()
      .from(blackListedRefreshTokenTable)
      .where(eq(blackListedRefreshTokenTable.refreshToken, refreshToken))
      .limit(1);

    return result[0] || null;
  }

  async generateTokens(id: string) {
    return await generateAuthToken(id);
  }
}
