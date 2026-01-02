import { z } from 'zod';
import { userCreateSchema, userSelectSchema } from '@/db/models/user.model';
import { authorizationTokens } from '@/constants/helpers';

export const verifyRegisterationBodySchema = userCreateSchema
  .pick({ email: true })
  .extend({
    otp: z.coerce
      .number()
      .positive()
      .max(999999)
      .openapi({ description: 'Give otp send to mail' }),
  });

export const verifyRegisterationResponse = z.object({
  user: userSelectSchema,
  tokens: authorizationTokens,
});

export type verifyRegisterInputs = z.infer<
  typeof verifyRegisterationBodySchema
>;
export type verifyRegisterResponse = z.infer<
  typeof verifyRegisterationResponse
>;
