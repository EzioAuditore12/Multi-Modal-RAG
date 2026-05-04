import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('production'),

  HOST: z.string().min(1).default('localhost'),

  PORT: z.coerce.number().int().positive().default(8080),

  CORS_ORIGIN: z.string().default('http://localhost:8080'),

  COMMON_RATE_LIMIT_MAX_REQUESTS: z.coerce
    .number()
    .int()
    .positive()
    .default(1000),

  COMMON_RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(1000),

  DATABASE_URL: z.string(),

  ACCESS_SECRET_KEY: z.string(),
  ACCESS_EXPIRATION_DURATION: z.string().default('5m'),

  REFRESH_SECRET_KEY: z.string(),
  REFRESH_EXPIRATION_DURATION: z.string().default('15m'),

  GOOGLE_API_KEY: z.string(),

  TAVILY_API_KEY: z.string(),

  CLOUDINARY_CLOUD_NAME: z
    .string()
    .trim()
    .min(1, 'CLOUDINARY_CLOUD_NAME is required'),
  CLOUDINARY_API_KEY: z
    .string()
    .trim()
    .min(1, 'CLOUDINARY_API_KEY is required'),
  CLOUDINARY_API_SECRET: z
    .string()
    .trim()
    .min(1, 'CLOUDINARY_API_SECRET is required'),

  UNSTRUCTURED_API_KEY: z.string(),
  UNSTRUCTURED_API_ENDPOINT: z.url(),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error('❌ Invalid environment variables:', parsedEnv.error.format());
  throw new Error('Invalid environment variables');
}

export const env = {
  ...parsedEnv.data,
  isDevelopment: parsedEnv.data.NODE_ENV === 'development',
  isProduction: parsedEnv.data.NODE_ENV === 'production',
  isTest: parsedEnv.data.NODE_ENV === 'test',
};
