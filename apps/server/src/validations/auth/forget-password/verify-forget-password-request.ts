import { userSelectSchema } from '@/db/models/user.model';
import z from 'zod';

export const verifyForgetPasswordRequestSchema = userSelectSchema
  .pick({ email: true })
  .extend({
    otp: z.coerce.number(),
  });

export const verifyForgetPasswordResponseSchema = userSelectSchema
  .pick({
    email: true,
  })
  .extend({
    verifiedToken: z.uuid(),
  });

export type verifyForgetPasswordRequestInputs = z.infer<
  typeof verifyForgetPasswordRequestSchema
>;
export type verifyForgetPasswordRequestResponse = z.infer<
  typeof verifyForgetPasswordResponseSchema
>;
