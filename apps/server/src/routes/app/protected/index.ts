import type { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { createRouter } from '@/lib/create-app';

// Routes
import { createUserRoutes } from './user.routes';

export function createProtectedRoutes(registry: OpenAPIRegistry) {
  const protectedRouter = createRouter();

  protectedRouter.use(createUserRoutes(registry));

  return protectedRouter;
}
