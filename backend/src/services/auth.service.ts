import {
  ConflictError,
  NotFoundError,
  UnauthenticatedError,
} from 'express-error-toolkit';

import { db } from '@/db';
import { blackListedRefreshTokenTable } from '@/db/models/blacklist-refresh-token.model';
import { userService } from './user.service';
import { cryptoPassword } from '@/utils/crypto-password';
import { RegisterResponse } from '@/schemas/auth/register/register-response.schema';
import { RegisterRequest } from '@/schemas/auth/register/register-request.schema';
import { ServiceResponse } from '@/utils/service-response';
import { jwt } from '@/utils/jwt';
import { publicUserSchema } from '@/db/models/user.model';
import { LoginRequest } from '@/schemas/auth/login/login-request.schema';
import { LoginResponse } from '@/schemas/auth/login/login-response.schema';
import { Tokens } from '@/schemas/auth/token.schema';

export class AuthService {
  private readonly database = db;
  private readonly table = blackListedRefreshTokenTable;

  private readonly userService = userService;

  private readonly cryptoPassword = cryptoPassword;
  private readonly jwtService = jwt;

  public async register(
    registerRequest: RegisterRequest,
  ): Promise<RegisterResponse> {
    const { email, password, name, avatar } = registerRequest;

    const isExistingUser = await this.userService.findByEmail(email);

    if (isExistingUser)
      throw new ConflictError('User with this email already exists');

    const hashedPassword =
      await this.cryptoPassword.generateHashedPassword(password);

    const registeredUser = await this.userService.create({
      name,
      email,
      password: hashedPassword,
      avatar,
    });

    const tokens = await this.jwtService.generateAuthTokens(registeredUser.id);

    const publicUserDetails = publicUserSchema.strip().parse(registeredUser);

    return {
      user: publicUserDetails,
      tokens,
    };
  }

  public async login(loginRequest: LoginRequest): Promise<LoginResponse> {
    const { email, password } = loginRequest;

    const existingUser = await this.userService.findByEmail(email);

    if (!existingUser)
      throw new NotFoundError('User with this email address does not exist');

    const isPasswordValid = await this.cryptoPassword.validatePassword(
      password,
      existingUser.password,
    );

    if (!isPasswordValid)
      throw new UnauthenticatedError(
        'Either entered email or password is wrong',
      );

    const tokens = await this.jwtService.generateAuthTokens(existingUser.id);

    const publicUserDetails = publicUserSchema.strip().parse(existingUser);

    return {
      user: publicUserDetails,
      tokens,
    };
  }

  public async refresh(token: string): Promise<Tokens> {
    const isBlacklistedToken = await this.isBlacklistedRefreshToken(token);

    if (isBlacklistedToken)
      throw new UnauthenticatedError('Given token is blacklisted');

    const tokenDetails = await this.jwtService.parseRefreshToken(token);

    if (!tokenDetails)
      throw new UnauthenticatedError('Given token is not valid');

    await this.insertBlaclistedRefreshToken({
      token,
      expiredAt: new Date(tokenDetails.exp),
      issuedAt: new Date(tokenDetails.iat),
    });

    const tokens = await this.jwtService.generateAuthTokens(tokenDetails.sub);

    return tokens;
  }

  private async insertBlaclistedRefreshToken({
    token,
    expiredAt,
    issuedAt,
  }: {
    token: string;
    issuedAt: Date;
    expiredAt: Date;
  }): Promise<void> {
    await this.database
      .insert(this.table)
      .values({ refreshToken: token, createdAt: issuedAt, expiredAt });
  }

  private async isBlacklistedRefreshToken(token: string): Promise<boolean> {
    const existingToken = await this.database
      .select({ id: this.table })
      .from(this.table)
      .then((res) => (res.length > 0 ? res[0] : null));

    if (existingToken) return true;

    return false;
  }
}

export const authService = new AuthService();
