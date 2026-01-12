import { z } from "zod";
import type { ValidatedRequest } from "express-zod-safe";

import { insertUserTableSchema } from "@/db/models/user.model";

export const loginRequestBodySchema = insertUserTableSchema
  .pick({
    email: true,
    password: true,
  })
  .extend({
    email: z.email(),
  });

export type LoginRequestBody = z.infer<typeof loginRequestBodySchema>;

export type LoginRequest = ValidatedRequest<{
  body: typeof loginRequestBodySchema;
}>;
