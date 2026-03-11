import { z } from "zod";
import type { ValidatedRequest } from "express-zod-safe";

export const refreshRequestSchema = z.object({
  refreshToken: z.jwt(),
});

export type RefreshRequest = z.infer<typeof refreshRequestSchema>;

export type RefreshRequestBody = ValidatedRequest<{
  body: typeof refreshRequestSchema;
}>;
