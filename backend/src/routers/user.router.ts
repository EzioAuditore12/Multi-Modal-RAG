import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import express, { type Router } from 'express';
import { z } from 'zod';

import { getUserSchema, selectUserSchema } from '@/db/models/user.model';

import { createApiResponse } from '@/lib/open-api/open-api-response-builder';

import { validateRequest } from '@/utils/http-handlers';

import { userController } from '@/controllers/user.controller';
import { authMiddleware } from '@/middlewares/auth.middleware';

export const userRegistry = new OpenAPIRegistry();
export const userRouter: Router = express.Router();

userRegistry.registerPath({
  method: 'get',
  path: '/user/profile',
  tags: ['User'],
  responses: createApiResponse(selectUserSchema, 'Success'),
});

userRouter.get('/profile', authMiddleware, userController.getProfile);

userRegistry.registerPath({
  method: 'get',
  path: '/user/{id}',
  tags: ['User'],
  request: { params: getUserSchema.shape.params },
  responses: createApiResponse(selectUserSchema, 'Success'),
});

userRouter.get('/:id', validateRequest(getUserSchema), userController.getUser);
