import type { RequestHandler, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { LoginRequestBody } from '@/schemas/auth/login/login-request.schema';
import { RefreshRequestBody } from '@/schemas/auth/refresh/request.schema';
import { RegisterRequestBody } from '@/schemas/auth/register/register-request.schema';
import { authService } from '@/services/auth.service';

export class AuthController {
  private readonly authService = authService;

  public register: RequestHandler = async (
    _req: RegisterRequestBody,
    res: Response,
  ) => {
    const result = await this.authService.register(_req.body);

    this.setAuthCookies(res, result.tokens);

    return res.status(StatusCodes.CREATED).send({ user: result.user });
  };

  public login: RequestHandler = async (
    _req: LoginRequestBody,
    res: Response,
  ) => {
    const result = await this.authService.login(_req.body);

    this.setAuthCookies(res, result.tokens);

    return res.status(StatusCodes.ACCEPTED).send({ user: result.user });
  };

  public refresh: RequestHandler = async (
    _req: RefreshRequestBody,
    res: Response,
  ) => {
    // Read refresh token from cookies instead of body!
    const refreshToken = _req.cookies.refreshToken || _req.body.refreshToken;
    const tokens = await this.authService.refresh(refreshToken);

    this.setAuthCookies(res, tokens);

    return res.status(StatusCodes.CREATED).send({ success: true });
  };

  private setAuthCookies(
    res: Response,
    tokens: { accessToken: string; refreshToken: string },
  ) {
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' as const : 'lax' as const,
    };

    res.cookie('accessToken', tokens.accessToken, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.cookie('refreshToken', tokens.refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
  }
}

export const authController = new AuthController();
