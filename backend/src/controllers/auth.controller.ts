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

    return res.status(StatusCodes.CREATED).send(result);
  };

  public login: RequestHandler = async (
    _req: LoginRequestBody,
    res: Response,
  ) => {
    const result = await this.authService.login(_req.body);

    return res.status(StatusCodes.ACCEPTED).send(result);
  };

  public refresh: RequestHandler = async (
    _req: RefreshRequestBody,
    res: Response,
  ) => {
    const result = await this.authService.refresh(_req.body.refreshToken);

    console.log(result);

    return res.status(StatusCodes.CREATED).send(result);
  };
}

export const authController = new AuthController();
