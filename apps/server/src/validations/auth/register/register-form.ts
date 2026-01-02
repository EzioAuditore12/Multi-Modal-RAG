import { userCreateSchema } from '@/db/models/user.model';
import validator from 'validator';
import z from 'zod';

export const registerUserFormSchema = userCreateSchema.refine(
  (val) => {
    return validator.isStrongPassword(val.password, {
      minLength: 8,
      minLowercase: 1,
      minNumbers: 1,
      minSymbols: 1,
      minUppercase: 1,
    });
  },
  {
    error:
      'Password should contain atleast 8 character with minimum 1 uppercase, lowercase, numbers and symbols',
    path: ['password'],
  },
);

export const registUserFormResponse = z.object({
  success: z.boolean(),
  email: z.email(),
  otpDuration: z.number(),
});

export type registerUserFormInput = z.infer<typeof registerUserFormSchema>;
export type registerUserFormResponse = z.infer<typeof registUserFormResponse>;
