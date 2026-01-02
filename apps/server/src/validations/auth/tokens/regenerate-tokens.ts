import { authorizationTokens } from '@/constants/helpers';
import validator from 'validator';
import { userSelectSchema } from '@/db/models/user.model';
import z from 'zod';

export const regenerateTokensRequestSchema = z.object({
  oldRefreshToken: z.string().refine((val) => validator.isJWT(val), {
    error: 'Given token is not jwt signature',
  }),
});

export const regenerateTokensResponseSchema = z.object({
  user: userSelectSchema,
  tokens: authorizationTokens,
});

export type regenerateTokenInputs = z.infer<
  typeof regenerateTokensRequestSchema
>;
export type regenerateTokenResponse = z.infer<
  typeof regenerateTokensResponseSchema
>;
