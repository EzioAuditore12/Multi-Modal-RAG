import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { z } from "zod";

import { createApiResponse } from "@/lib/open-api/open-api-response-builder";

import { authMiddleware } from "@/middlewares/auth.middleware";
import { aiController } from "@/controllers/ai.controller";

export const aiRegistry = new OpenAPIRegistry();
export const aiRouter: Router = express.Router();

aiRegistry.registerPath({
  method: "get",
  path: "/ai/test",
  tags: ["Ai"],
  responses: createApiResponse(z.object({ result: z.any() }), "Success"),
});

aiRouter.get("/test", aiController.test);

aiRegistry.registerPath({
  method: "get",
  path: "/ai/agent-builder",
  tags: ["Ai"],
  responses: createApiResponse(z.object({ result: z.any() }), "Success"),
});

aiRouter.get("/agent-builder", aiController.agentBuilder);
