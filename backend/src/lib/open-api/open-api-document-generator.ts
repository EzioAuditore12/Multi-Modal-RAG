import {
  OpenAPIRegistry,
  OpenApiGeneratorV3,
} from '@asteasolutions/zod-to-openapi';

import { healthCheckRegistry } from '@/routers/health-check.router';
import { userRegistry } from '@/routers/user.router';
import { authRegistry } from '@/routers/auth.router';
import { projectRegistry } from '@/routers/project.router';
import { chatRegistry } from '@/routers/chat.router';

export type OpenAPIDocument = ReturnType<
  OpenApiGeneratorV3['generateDocument']
>;

export function generateOpenAPIDocument(): OpenAPIDocument {
  const registry = new OpenAPIRegistry([
    healthCheckRegistry,
    userRegistry,
    authRegistry,
    projectRegistry,
    chatRegistry,
  ]);
  const generator = new OpenApiGeneratorV3(registry.definitions);

  return generator.generateDocument({
    openapi: '3.0.0',
    info: {
      version: '1.0.0',
      title: 'Scalar API',
    },
  });
}
