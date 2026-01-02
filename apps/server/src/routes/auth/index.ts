import type { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { createRouter } from '@/lib/create-app';

// Routes
import { createLoginRoutes } from './login.routes';
import { createRegisterationRoutes } from './registeration.routes';
import { createForgetPasswordRoutes } from './forgot-password.routes';
import { createTokenRoutes } from './tokens.routes';

export function createAuthRoutes(registry: OpenAPIRegistry) {
  const authRouter = createRouter();

  authRouter.use(createRegisterationRoutes(registry));
  authRouter.use(createLoginRoutes(registry));
  authRouter.use(createForgetPasswordRoutes(registry));
  authRouter.use(createTokenRoutes(registry));

  return authRouter;
}
