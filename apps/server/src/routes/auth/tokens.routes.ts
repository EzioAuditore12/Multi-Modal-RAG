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
  regenerateTokensRequestSchema,
  regenerateTokensResponseSchema,
} from '@/validations/auth/tokens/regenerate-tokens';

// Controllers
import { regenerateTokens } from '@/controllers/auth/tokens/regenerate-tokens';

const regenerateTokensPath: RouteConfig = {
  tags: ['Auth'],
  method: 'post',
  path: '/auth/regenerate-tokens',
  description: 'Regenerate the authorization tokens',
  summary: 'Regenerate Tokens',
  request: {
    body: jsonContent(regenerateTokensRequestSchema),
  },
  responses: {
    [HTTPStatusCode.OK]: {
      description: 'Tokens Regenerated Successfully',
      ...jsonContent(regenerateTokensResponseSchema),
    },
    [HTTPStatusCode.NOT_FOUND]: {
      description: 'User not found',
      ...jsonContent(notFoundRequestSchema),
    },
    [HTTPStatusCode.UNAUTHORIZED]: {
      description: 'Given refresh token is invalid or expired',
      ...jsonContent(unauthorizedRequestSchema),
    },
  },
};

export function createTokenRoutes(registry: OpenAPIRegistry) {
  const tokensRoutes = createRouter();

  // Register OpenAPI paths
  registry.registerPath(regenerateTokensPath);

  tokensRoutes.post(
    '/auth/regenerate-tokens',
    validateBody(regenerateTokensRequestSchema),
    regenerateTokens,
  );

  return tokensRoutes;
}
