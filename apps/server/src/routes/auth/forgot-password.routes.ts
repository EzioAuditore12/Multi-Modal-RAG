import type {
  RouteConfig,
  OpenAPIRegistry,
} from '@asteasolutions/zod-to-openapi';
import { jsonContent } from '@/constants/helpers';
import {
  conflictResponseSchema,
  HTTPStatusCode,
  notFoundRequestSchema,
  unauthorizedRequestSchema,
} from '@/constants/http-status';
import { createRouter } from '@/lib/create-app';
import { validateBody } from '@/middleware/zod-body-middleware';

// Validations
import {
  forgotPasswordRequestSchema,
  forgotPasswordResponseSchema,
} from '@/validations/auth/forget-password/forget-password-request';
import {
  verifyForgetPasswordRequestSchema,
  verifyForgetPasswordResponseSchema,
} from '@/validations/auth/forget-password/verify-forget-password-request';
import {
  changePasswordRequestSchema,
  changePasswordResponseSchema,
} from '@/validations/auth/forget-password/change-password';

// Controllers
import {
  changePassword,
  forgetPasswordTrigger,
  verifyForgetPasswordRequest,
} from '@/controllers/auth/forget-password';

const forgetPasswordRequestPath: RouteConfig = {
  tags: ['Auth'],
  method: 'post',
  path: '/auth/forget-password-request',
  description: 'Trigger Forget Password Request',
  summary: 'Trigger Forget Password Request',
  request: {
    body: jsonContent(forgotPasswordRequestSchema),
  },
  responses: {
    [HTTPStatusCode.OK]: {
      description: 'OTP sent to email',
      ...jsonContent(forgotPasswordResponseSchema),
    },
    [HTTPStatusCode.NOT_FOUND]: {
      description: 'User not found',
      ...jsonContent(notFoundRequestSchema),
    },
  },
};

const verifyForgetPasswordRequestPath: RouteConfig = {
  tags: ['Auth'],
  method: 'post',
  path: '/auth/verify-forget-password-request',
  summary: 'Verify Forget Password Request',
  description: 'Verify the forget Password Request',
  request: {
    body: jsonContent(verifyForgetPasswordRequestSchema),
  },
  responses: {
    [HTTPStatusCode.ACCEPTED]: {
      description: 'Request has been verified successfully',
      ...jsonContent(verifyForgetPasswordResponseSchema),
    },
    [HTTPStatusCode.NOT_FOUND]: {
      description: 'No user or such request has been found',
      ...jsonContent(notFoundRequestSchema),
    },
    [HTTPStatusCode.UNAUTHORIZED]: {
      description: 'Entered wrong otp',
      ...jsonContent(unauthorizedRequestSchema),
    },
  },
};

const changePasswordRequestPath: RouteConfig = {
  tags: ['Auth'],
  method: 'post',
  path: '/auth/change-password-request',
  summary: 'Change the password',
  description: 'Change Password Request',
  request: {
    body: jsonContent(changePasswordRequestSchema),
  },
  responses: {
    [HTTPStatusCode.ACCEPTED]: {
      description: 'Password has been changed successfully',
      ...jsonContent(changePasswordResponseSchema),
    },
    [HTTPStatusCode.NOT_FOUND]: {
      description: 'No user or such request has been found',
      ...jsonContent(notFoundRequestSchema),
    },
    [HTTPStatusCode.CONFLICT]: {
      description: 'Entered password is same as previous one',
      ...jsonContent(conflictResponseSchema),
    },
  },
};

export function createForgetPasswordRoutes(registry: OpenAPIRegistry) {
  const forgetPasswordRoutes = createRouter();

  // Register OpenAPI paths
  registry.registerPath(forgetPasswordRequestPath);
  registry.registerPath(verifyForgetPasswordRequestPath);
  registry.registerPath(changePasswordRequestPath);

  forgetPasswordRoutes.post(
    '/auth/forget-password-request',
    validateBody(forgotPasswordRequestSchema),
    forgetPasswordTrigger,
  );
  forgetPasswordRoutes.post(
    '/auth/verify-forget-password-request',
    validateBody(verifyForgetPasswordRequestSchema),
    verifyForgetPasswordRequest,
  );
  forgetPasswordRoutes.post(
    '/auth/change-password-request',
    validateBody(changePasswordRequestSchema),
    changePassword,
  );

  return forgetPasswordRoutes;
}
