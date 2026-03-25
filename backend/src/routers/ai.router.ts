import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import express, { type Router } from 'express';
import { z } from 'zod';

import { createApiResponse } from '@/lib/open-api/open-api-response-builder';

import { authMiddleware } from '@/middlewares/auth.middleware';
import { aiController } from '@/controllers/ai.controller';
import { articleGenerateSchema } from '@/schemas/ai/article/article-generate-request.schema';
import validate from 'express-zod-safe';
import { articleGeneraterResponseSchema } from '@/schemas/ai/article/article-generate-response.schema';

export const aiRegistry = new OpenAPIRegistry();
export const aiRouter: Router = express.Router();

aiRegistry.registerPath({
  method: 'get',
  path: '/ai/test',
  tags: ['Ai'],
  responses: createApiResponse(z.object({ result: z.any() }), 'Success'),
});

aiRouter.get('/test', aiController.test);

aiRegistry.registerPath({
  method: 'get',
  path: '/ai/agent-builder',
  tags: ['Ai'],
  responses: createApiResponse(z.object({ result: z.any() }), 'Success'),
});

aiRouter.get('/agent-builder', aiController.agentBuilder);

aiRegistry.registerPath({
  method: 'post',
  path: '/ai/article-generator',
  request: {
    body: {
      content: { 'application/json': { schema: articleGenerateSchema } },
    },
  },
  tags: ['Ai'],
  responses: createApiResponse(articleGeneraterResponseSchema, 'Success'),
});

aiRouter.post(
  '/article-generator',
  validate({ body: articleGenerateSchema }),
  aiController.generateArticle,
);
