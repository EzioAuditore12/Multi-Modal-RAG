import { z } from 'zod';

export const refreshResponseSchema = z.object({
  success: z.boolean(),
});

export type RefreshResponse = z.infer<typeof refreshResponseSchema>;
