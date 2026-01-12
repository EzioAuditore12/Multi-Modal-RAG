import validator from "validator";
import { z } from "zod";
import type { ValidatedRequest } from "express-zod-safe";

export const refreshTokenRequestBodySchema = z.object({
  refreshToken: z.string().refine((val) => validator.isJWT(val), {
    error: "Given refresh token should be a valid jwt signature",
  }),
});

export type RefreshTokenRequestBody = z.infer<
  typeof refreshTokenRequestBodySchema
>;

export type RefreshTokensRequest = ValidatedRequest<{
  body: typeof refreshTokenRequestBodySchema;
}>;
