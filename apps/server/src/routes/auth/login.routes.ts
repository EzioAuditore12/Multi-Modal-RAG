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
import { validateBody } from '@/middleware/zod-body-middleware';

// Validations
import {
  userLoginSchema,
  userLoginResponseSchema,
} from '@/validations/auth/login/login-form';

// Controllers
import { loginUserForm } from '@/controllers/auth/login/login-user-form';

const loginUserFormPath: RouteConfig = {
  tags: ['Auth'],
  method: 'post',
  path: '/auth/login',
  description: 'Login User',
  summary: 'Login User',
  request: {
    body: jsonContent(userLoginSchema),
  },
  responses: {
    [HTTPStatusCode.OK]: {
      description: 'User logged in',
      ...jsonContent(userLoginResponseSchema),
    },
    [HTTPStatusCode.NOT_FOUND]: {
      description: 'User not found',
      ...jsonContent(notFoundRequestSchema),
    },
    [HTTPStatusCode.UNAUTHORIZED]: {
      description: 'Either entered password or email is incorrect',
      ...jsonContent(unauthorizedRequestSchema),
    },
  },
};

export function createLoginRoutes(registry: OpenAPIRegistry) {
  const loginRoutes = createRouter();

  // Register OpenAPI paths
  registry.registerPath(loginUserFormPath);

  loginRoutes.post('/auth/login', validateBody(userLoginSchema), loginUserForm);

  return loginRoutes;
}
