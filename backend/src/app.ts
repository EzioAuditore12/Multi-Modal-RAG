import cors from "cors";
import express, { type Express } from "express";
import helmet from "helmet";

import { healthCheckRouter } from "@/routers/health-check.router";
import { userRouter } from "@/routers/user.router";
import { openAPIRouter } from "@/lib/open-api/open-api-router";

import errorHandler from "@/middlewares/error-handler";
import rateLimiter from "@/middlewares/rate-limiter";
import requestLogger from "@/middlewares/request-logger";

import { env } from "@/env";
import { authRouter } from "./routers/auth.router";

const app: Express = express();

// Set the application to trust the reverse proxy
app.set("trust proxy", true);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "https://cdn.jsdelivr.net", "'unsafe-inline'"],
        styleSrc: ["'self'", "https://cdn.jsdelivr.net", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https://cdn.jsdelivr.net"],
        fontSrc: ["'self'", "https://cdn.jsdelivr.net", "data:"],
        // Add other directives as needed
      },
    },
  }),
);
app.use(rateLimiter);

// Request logging
app.use(requestLogger);

// Routes
app.use("/health-check", healthCheckRouter);
app.use("/users", userRouter);
app.use(authRouter);

// Swagger UI
app.use(openAPIRouter);

// Error handlers
app.use(errorHandler());

export { app };
