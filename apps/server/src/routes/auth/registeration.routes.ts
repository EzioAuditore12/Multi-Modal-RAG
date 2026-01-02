import type {
  OpenAPIRegistry,
  RouteConfig,
} from '@asteasolutions/zod-to-openapi';
import {
  HTTPStatusCode,
  conflictResponseSchema,
  notFoundRequestSchema,
  unauthorizedRequestSchema,
} from '@/constants/http-status';
import { createRouter } from '@/lib/create-app';
import { formDataContent, jsonContent } from '@/constants/helpers';
import { validateBody } from '@/middleware/zod-body-middleware';
import { uploadImages } from '@/middleware/multer';

// Auth Controllers
import {
  registerUserForm,
  verifyRegisterationForm,
} from '@/controllers/auth/register';
import {
  registerUserFormSchema,
  registUserFormResponse,
} from '@/validations/auth/register/register-form';
import {
  verifyRegisterationBodySchema,
  verifyRegisterationResponse,
} from '@/validations/auth/register/verify-registeration';

const registerUserFormPath: RouteConfig = {
  tags: ['Auth'],
  method: 'post',
  path: '/auth/register',
  description: 'Create a new user',
  summary: 'Create User',
  request: {
    body: formDataContent(registerUserFormSchema),
  },
  responses: {
    [HTTPStatusCode.OK]: {
      description: 'OTP sent for verification',
      ...jsonContent(registUserFormResponse),
    },
    [HTTPStatusCode.CONFLICT]: {
      description: 'User already exists',
      ...jsonContent(conflictResponseSchema),
    },
  },
};

const verifyRegisterationFormPath: RouteConfig = {
  tags: ['Auth'],
  method: 'post',
  path: '/auth/verify-registeration',
  description: 'Verify Registeration Procedure',
  summary: 'Verify Registeration',
  request: {
    body: jsonContent(verifyRegisterationBodySchema),
  },
  responses: {
    [HTTPStatusCode.CREATED]: {
      description: 'User created',
      ...jsonContent(verifyRegisterationResponse),
    },
    [HTTPStatusCode.NOT_FOUND]: {
      description: 'No registeration request found',
      ...jsonContent(notFoundRequestSchema),
    },
    [HTTPStatusCode.UNAUTHORIZED]: {
      description: 'Given credentials are wrong',
      ...jsonContent(unauthorizedRequestSchema),
    },
    [HTTPStatusCode.CONFLICT]: {
      description: 'User already created',
      ...jsonContent(conflictResponseSchema),
    },
  },
};

export function createRegisterationRoutes(registry: OpenAPIRegistry) {
  const registerationRoutes = createRouter();

  // Register OpenAPI paths
  registry.registerPath(registerUserFormPath);
  registry.registerPath(verifyRegisterationFormPath);

  registerationRoutes.post(
    '/auth/register',
    uploadImages.single('profilePicture'),
    validateBody(registerUserFormSchema),
    registerUserForm,
  );

  registerationRoutes.post(
    '/auth/verify-registeration',
    validateBody(verifyRegisterationBodySchema),
    verifyRegisterationForm,
  );
  return registerationRoutes;
}
