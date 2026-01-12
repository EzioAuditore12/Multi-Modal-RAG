import validate from "express-zod-safe";
import { Router } from "express";

import { registerRequestBodySchema } from "@/validators/auth/register/register-request-body.schema";
import { AuthController } from "@/controllers/auth.controller";
import { loginRequestBodySchema } from "@/validators/auth/login/login-request-body.schema";
import { AuthService } from "@/services/auth.service";
import { refreshTokenRequestBodySchema } from "@/validators/auth/refresh-request-body.schema";

const authRouter = Router();

const authService = new AuthService();
const authController = new AuthController(authService);

authRouter
  .route("/register")
  .post(validate({ body: registerRequestBodySchema }), authController.register);

authRouter
  .route("/login")
  .post(validate({ body: loginRequestBodySchema }), authController.login);

authRouter
  .route("/refresh")
  .post(
    validate({ body: refreshTokenRequestBodySchema }),
    authController.refresh
  );

export default authRouter;
