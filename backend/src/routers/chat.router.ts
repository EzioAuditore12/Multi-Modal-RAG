import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import express, { Router } from 'express';
import validate from 'express-zod-safe';
import { z } from 'zod';

import { chatController } from '@/controllers/chat.controller';
import { authMiddleware } from '@/middlewares/auth.middleware';
import { createNewChatSchema } from '@/schemas/chat/new/request';
import { getProjectChatsSchema } from '@/schemas/chat/get-project-chats';
import { createApiResponse } from '@/lib/open-api/open-api-response-builder';
import { chatSchema } from '@/db/models/chat.model';

export const chatRegistry = new OpenAPIRegistry();
export const chatRouter: Router = express.Router();

const TAGS = ['Chat'];

chatRegistry.registerPath({
  method: 'get',
  path: '/chat',
  tags: TAGS,
  request: {
    query: getProjectChatsSchema,
    headers: z.object({
      Authorization: z.string().describe('Bearer token for authentication'),
    }),
  },
  responses: createApiResponse(chatSchema.array(), 'Success'),
});

chatRouter.get(
  '/',
  //@ts-ignore
  validate({ query: getProjectChatsSchema }),
  authMiddleware,
  chatController.getChatsofProject,
);

chatRouter.get(
  '/new',
  //@ts-ignore
  validate({ query: createNewChatSchema }),
  authMiddleware,
  chatController.createNewChat,
);
