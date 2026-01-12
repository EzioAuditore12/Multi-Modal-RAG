import type { Response } from "express";
import { status } from "http-status";

import { AuthService } from "@/services/auth.service";

import type { RegisterRequest } from "@/validators/auth/register/register-request-body.schema";
import type { LoginRequest } from "@/validators/auth/login/login-request-body.schema";
import type { RegisterResponseBody } from "@/validators/auth/register/register-response-body.schema";
import type { RefreshTokensRequest } from "@/validators/auth/refresh-request-body.schema";

export class AuthController {
  constructor(private authService: AuthService) {}

  register = async (
    req: RegisterRequest,
    res: Response<RegisterResponseBody>
  ) => {
    const registerRequestBody = req.body;
    const registeredUser = await this.authService.register(registerRequestBody);
    return res.status(status.CREATED).send(registeredUser);
  };

  login = async (req: LoginRequest, res: Response) => {
    const loginRequestBody = req.body;
    const validatedUser = await this.authService.loginUser(loginRequestBody);
    return res.status(status.OK).send(validatedUser);
  };

  refresh = async (req: RefreshTokensRequest, res: Response) => {
    const refreshRequestBody = req.body;

    const updatedTokens = await this.authService.refreshTokens(
      refreshRequestBody.refreshToken
    );

    return res.status(status.CREATED).send(updatedTokens);
  };
}
