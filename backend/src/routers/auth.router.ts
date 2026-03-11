import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import validate from "express-zod-safe";

import { registerRequestSchema } from "@/schemas/auth/register/register-request.schema";
import { registerResponseSchema } from "@/schemas/auth/register/register-response.schema";

import { createApiResponse } from "@/lib/open-api/open-api-response-builder";

import { authController } from "@/controllers/auth.controller";
import { loginRequestSchema } from "@/schemas/auth/login/login-request.schema";
import { loginResponseSchema } from "@/schemas/auth/login/login-response.schema";
import { refreshRequestSchema } from "@/schemas/auth/refresh/request.schema";
import { tokensSchema } from "@/schemas/auth/token.schema";

export const authRegistry = new OpenAPIRegistry();
export const authRouter: Router = express.Router();

authRegistry.registerPath({
  method: "post",
  path: "/auth/register",
  tags: ["Auth"],
  request: {
    body: {
      content: { "application/json": { schema: registerRequestSchema } },
    },
  },
  responses: createApiResponse(registerResponseSchema, "Success"),
});

authRouter.post(
  "/auth/register",
  validate({ body: registerRequestSchema }),
  authController.register,
);

authRegistry.registerPath({
  method: "post",
  path: "/auth/login",
  tags: ["Auth"],
  request: {
    body: {
      content: { "application/json": { schema: loginRequestSchema } },
    },
  },
  responses: createApiResponse(loginResponseSchema, "Success"),
});

authRouter.post(
  "/auth/login",
  validate({ body: loginRequestSchema }),
  authController.login,
);

authRegistry.registerPath({
  method: "post",
  path: "/auth/refresh",
  tags: ["Auth"],
  request: {
    body: {
      content: { "application/json": { schema: refreshRequestSchema } },
    },
  },
  responses: createApiResponse(tokensSchema, "Success"),
});

authRouter.post(
  "/auth/refresh",
  validate({ body: refreshRequestSchema }),
  authController.refresh,
);
