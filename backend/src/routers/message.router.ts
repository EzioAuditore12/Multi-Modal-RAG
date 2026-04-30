import { messageController } from '@/controllers/message.controller';
import { createApiResponse } from '@/lib/open-api/open-api-response-builder';
import { getChatMessagesSchema } from '@/schemas/messages/get-messages/request.schema';
import { getMessagesResponseSchema } from '@/schemas/messages/get-messages/response.schema';
import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import express, { Router } from 'express';
import validate from 'express-zod-safe';

export const messageRegistry = new OpenAPIRegistry();
export const messageRouter: Router = express.Router();

messageRegistry.registerPath({
  path: '/message',
  tags: ['Message'],
  method: 'get',
  request: {
    query: getChatMessagesSchema,
  },
  responses: createApiResponse(getMessagesResponseSchema, 'Success'),
});

messageRouter.get(
  '/',
  validate({ query: getChatMessagesSchema }),
  messageController.getAll,
);
