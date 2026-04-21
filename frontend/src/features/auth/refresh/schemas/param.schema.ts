import { z } from 'zod';

export const refreshParamSchema = z.object({
  refreshToken: z.jwt(),
});

export type RefreshParam = z.infer<typeof refreshParamSchema>;
