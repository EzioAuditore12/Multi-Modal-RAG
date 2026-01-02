import { userCreateSchema, userSelectSchema } from '@/db/models/user.model';
import { authorizationTokens } from '@/constants/helpers';
import { z } from 'zod';
import validator from 'validator';

export const changePasswordRequestSchema = userCreateSchema
  .pick({
    email: true,
    password: true,
  })
  .extend({
    verifiedToken: z.uuid(),
  })
  .refine(
    (val) =>
      validator.isStrongPassword(val.password, {
        minLength: 8,
        minLowercase: 1,
        minNumbers: 1,
        minSymbols: 1,
        minUppercase: 1,
      }),
    {
      message: 'Password is not strong enough',
    },
  );

export const changePasswordResponseSchema = z.object({
  user: userSelectSchema,
  tokens: authorizationTokens,
});

export type changePasswordRequestInputs = z.infer<
  typeof changePasswordRequestSchema
>;
export type changePasswordRequestResponse = z.infer<
  typeof changePasswordResponseSchema
>;
