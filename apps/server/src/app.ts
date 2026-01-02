import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { configureOpenAPI } from './lib/configure-openapi';
import { createApp } from './lib/create-app';
import { errorHandler } from './middleware/error-handler';

const registry = new OpenAPIRegistry();
const app = createApp();

import indexRoute from './routes/index.route';
import { createAuthRoutes } from './routes/auth';
import { createProtectedRoutes } from './routes/app/protected';

app.use(indexRoute);
app.use(createAuthRoutes(registry));
app.use(createProtectedRoutes(registry));

configureOpenAPI(app, registry);

app.use(errorHandler);

export default app;
