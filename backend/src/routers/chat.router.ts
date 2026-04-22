import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import express, { Router } from 'express';
import validate from 'express-zod-safe';

import { chatController } from '@/controllers/chat.controller';
import { requestBody } from '@/lib/open-api/open-api-request-builder';
import { createApiResponse } from '@/lib/open-api/open-api-response-builder';
import { authMiddleware } from '@/middlewares/auth.middleware';
import { createNewChatSchema } from '@/schemas/chat/new/request';
import { createNewChatResponseSchema } from '@/schemas/chat/new/response.schema';

export const chatRegistry = new OpenAPIRegistry();
export const chatRouter: Router = express.Router();

const TAGS = ['Chat'];

chatRegistry.registerPath({
  method: 'post',
  path: '/chat/new',
  tags: TAGS,
  request: {
    body: requestBody(createNewChatSchema),
  },
  responses: createApiResponse(createNewChatResponseSchema, 'Success'),
});

chatRouter.post(
  '/new',
  validate({ body: createNewChatSchema }),
  authMiddleware,
  chatController.createNewChat,
);
