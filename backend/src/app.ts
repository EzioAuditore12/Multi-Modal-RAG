import cors from 'cors';
import express, { type Express } from 'express';

import { healthCheckRouter } from '@/routers/health-check.router';
import { userRouter } from '@/routers/user.router';
import { openAPIRouter } from '@/lib/open-api/open-api-router';

import errorHandler from '@/middlewares/error-handler';
import rateLimiter from '@/middlewares/rate-limiter';
import requestLogger from '@/middlewares/request-logger';
import helmet from '@/middlewares/helmet.middleware';

import { env } from '@/env';
import { authRouter } from './routers/auth.router';
import { projectRouter } from './routers/project.router';

const app: Express = express();

// Set the application to trust the reverse proxy
app.set('trust proxy', true);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(helmet);
app.use(rateLimiter);

// Request logging
app.use(requestLogger);

// Routes
app.use('/health-check', healthCheckRouter);
app.use('/user', userRouter);
app.use(authRouter);
app.use('/project', projectRouter);

// Swagger UI
app.use(openAPIRouter);

// Error handlers
app.use(errorHandler());

export { app };
