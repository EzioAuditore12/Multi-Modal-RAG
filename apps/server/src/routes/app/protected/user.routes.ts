import type {
  RouteConfig,
  OpenAPIRegistry,
} from '@asteasolutions/zod-to-openapi';
import { jsonContent } from '@/constants/helpers';
import {
  HTTPStatusCode,
  notFoundRequestSchema,
  unauthorizedRequestSchema,
} from '@/constants/http-status';
import { createRouter } from '@/lib/create-app';

// Validations
import { userSelectSchema } from '@/db/models/user.model';

// Middleware
import { authMiddleware } from '@/middleware/auth-middleware';

// Controllers
import { getUserProfile } from '@/controllers/app/protected/user/user-profile';

const getUserProfilePath: RouteConfig = {
  tags: ['User'],
  method: 'get',
  path: '/user/profile',
  description: 'User Profile',
  summary: 'Get User Profile',
  responses: {
    [HTTPStatusCode.OK]: {
      description: 'User profile Retreival',
      ...jsonContent(userSelectSchema),
    },
    [HTTPStatusCode.NOT_FOUND]: {
      description: 'User not found',
      ...jsonContent(notFoundRequestSchema),
    },
    [HTTPStatusCode.UNAUTHORIZED]: {
      description: 'Given auturoization headers are not correct',
      ...jsonContent(unauthorizedRequestSchema),
    },
  },
};

export function createUserRoutes(registry: OpenAPIRegistry) {
  const userRoutes = createRouter();

  // Register OpenAPI paths
  registry.registerPath(getUserProfilePath);

  userRoutes.get('/user/profile', authMiddleware, getUserProfile);

  return userRoutes;
}
