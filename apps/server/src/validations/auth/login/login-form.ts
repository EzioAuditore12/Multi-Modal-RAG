import { userCreateSchema, userSelectSchema } from '@/db/models/user.model';
import { authorizationTokens } from '@/constants/helpers';
import { z } from 'zod';

export const userLoginSchema = userCreateSchema.pick({
  email: true,
  password: true,
});

export const userLoginResponseSchema = z.object({
  user: userSelectSchema,
  tokens: authorizationTokens,
});

export type userLoginInputs = z.infer<typeof userLoginSchema>;
export type userLoginResponse = z.infer<typeof userLoginResponseSchema>;
