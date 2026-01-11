import "dotenv/config";
import { z } from "zod";

const serverConfigSchema = z.object({
  PORT: z.coerce.number().int().positive().default(3000),
});

const jwtConfigSchema = z.object({
  ACCESS_SECRET_KEY: z.string(),
  ACCESS_EXPIRATION_DURATION: z.coerce.number().positive(),
  REFRESH_SECRET_KEY: z.string(),
  REFRESH_EXPIRATION_DURATION: z.coerce.number().positive(),
});

const envSchema = serverConfigSchema.and(jwtConfigSchema);

const env = envSchema.parse(process.env);

export default env;
