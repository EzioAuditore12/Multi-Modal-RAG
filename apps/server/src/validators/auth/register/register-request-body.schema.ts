import validator from "validator";
import { z } from "zod";
import type { ValidatedRequest } from "express-zod-safe";

import { insertUserTableSchema } from "@/db/models/user.model";

export const registerRequestBodySchema = insertUserTableSchema
  .pick({
    name: true,
    avatar: true,
    email: true,
    password: true,
  })
  .extend({
    email: z.email().max(240),
    name: z.string().max(50),
    password: z.string().refine(
      (val) =>
        validator.isStrongPassword(val, {
          minLength: 8,
          minLowercase: 1,
          minNumbers: 1,
          minUppercase: 1,
          minSymbols: 1,
        }),
      {
        error: "Password should be strong enough",
      }
    ),
  });

export type RegisterRequestBody = z.infer<typeof registerRequestBodySchema>;

export type RegisterRequest = ValidatedRequest<{
  body: typeof registerRequestBodySchema;
}>;
