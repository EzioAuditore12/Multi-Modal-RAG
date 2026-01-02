import { userSelectSchema } from '@/db/models/user.model';
import { z } from 'zod';

export const forgotPasswordRequestSchema = userSelectSchema.pick({
  email: true,
});

export const forgotPasswordResponseSchema = userSelectSchema
  .pick({ email: true })
  .extend({
    otpDuration: z.number(),
  });

export type forgotPasswordRequestInputs = z.infer<
  typeof forgotPasswordRequestSchema
>;
export type forgotPasswordRequestResponse = z.infer<
  typeof forgotPasswordResponseSchema
>;
