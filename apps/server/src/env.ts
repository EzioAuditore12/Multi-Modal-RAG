import 'dotenv/config';
import z from 'zod';

const serverConfigSchema = z.object({
  PORT: z.coerce.number().int().positive().default(3000),
  DATABASE_URL: z.url(),
  REDIS_URL: z.url(),
});

const nodemailerConfigSchema = z.object({
  NODEMAILER_SMTP_PASS: z.string(),
  NODEMAILER_SMTP_HOST: z.string(),
  NODEMAILER_SMTP_USER: z.string().email(),
  NODEMAILER_SMTP_PORT: z.coerce.number().int().positive(),
  NODEMAILER_FROM_EMAIL: z.string().email(),
});

const textBeeConfigSchema = z.object({
  TEXTBEE_BASE_URL: z.string().url(),
  TEXTBEE_API_KEY: z.string(),
  TEXTBEE_DEVICE_ID: z.string(),
});

const appWriteConfigSchema = z.object({
  APPWRITE_ENDPOINT: z.string().url(),
  APPWRITE_PROJECT_ID: z.string(),
  APPWRITE_API_KEY: z.string(),
  APPWRITE_BUCKET_ID: z.string(),
});

const jwtConfigSchema = z.object({
  ACCESS_SECRET_KEY: z.string(),
  ACCESS_EXPIRATION_DURATION: z.coerce.number().positive(),
  REFRESH_SECRET_KEY: z.string(),
  REFRESH_EXPIRATION_DURATION: z.coerce.number().positive(),
});

const envSchema = serverConfigSchema
  .and(jwtConfigSchema)
  .and(nodemailerConfigSchema)
  .and(appWriteConfigSchema)
  .and(textBeeConfigSchema);

const env = envSchema.parse(process.env);

export default env;
