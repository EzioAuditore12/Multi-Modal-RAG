import { HTTPStatusCode } from '@/constants/http-status';
import type {
  AppRequest,
  AppResponse,
  ErrorResponse,
  AppRouteHandler,
} from '@/lib/types';
import { db } from '@/db';
import { eq } from 'drizzle-orm';
import { generateHashedPassword } from '@/utils/crypto-password';
import { redisClient } from '@/lib/redis-client';
import { addEmailJob } from '@/jobs/send-email';
import { generateOTP } from '@/utils/otp-auth';

// models
import { userTable } from '@/db/models/user.model';

// Request Responses
import type {
  registerUserFormInput,
  registerUserFormResponse,
} from '@/validations/auth/register/register-form';

export type registerUserStoredRedisType = registerUserFormInput & {
  otp: number;
};
export const registerUserRedisKey = 'register';

export const registerUserForm: AppRouteHandler<
  AppRequest<Record<string, never>, registerUserFormInput>,
  AppResponse<registerUserFormResponse | ErrorResponse>
> = async (req, res) => {
  const { email, name, password } = req.body;

  const [existingUser] = await db
    .select()
    .from(userTable)
    .where(eq(userTable.email, email))
    .limit(1);

  if (existingUser) {
    return res.status(HTTPStatusCode.CONFLICT).json({
      message: 'User already exists',
    });
  }

  const hashedPassword = await generateHashedPassword(password);

  const otp = generateOTP(6);
  const expireMinutes = 10;

  await redisClient.set(
    `${registerUserRedisKey}:${email}`,
    JSON.stringify({
      email,
      name,
      password: hashedPassword,
      otp,
    }),
    'EX',
    expireMinutes * 60,
  );

  // Add email job to send OTP
  await addEmailJob({
    toMail: email,
    body: `Your otp is ${otp}`,
    subject: 'OTP for veridication',
  });

  return res.status(HTTPStatusCode.OK).json({
    success: true,
    email,
    otpDuration: expireMinutes * 60,
  });
};
