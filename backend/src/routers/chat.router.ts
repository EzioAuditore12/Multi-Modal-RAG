import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import express, { Router } from 'express';
import validate from 'express-zod-safe';

import { chatController } from '@/controllers/chat.controller';
import { authMiddleware } from '@/middlewares/auth.middleware';
import { createNewChatSchema } from '@/schemas/chat/new/request';

export const chatRegistry = new OpenAPIRegistry();
export const chatRouter: Router = express.Router();

const TAGS = ['Chat'];

chatRouter.get(
  '/new',
  //@ts-ignore
  validate({ query: createNewChatSchema }),
  authMiddleware,
  chatController.createNewChat,
);
