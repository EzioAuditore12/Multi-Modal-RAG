import type {
  AppRouteHandler,
  AppRequest,
  AppResponse,
  ErrorResponse,
} from '@/lib/types';
import { db } from '@/db';
import { eq } from 'drizzle-orm';
import { HTTPStatusCode } from '@/constants/http-status';
import { redisClient } from '@/lib/redis-client';
import { generateOTP } from '@/utils/otp-auth';
import { sendEmail } from '@/providers/nodemailer';

// models
import { userTable } from '@/db/models/user.model';

// Request and Responses
import type {
  forgotPasswordRequestInputs,
  forgotPasswordRequestResponse,
} from '@/validations/auth/forget-password/forget-password-request';

export const forgetPasswordRequestRedisStoreKey = 'forget-request';
export type forgetPaswordRedisStorage = forgotPasswordRequestInputs & {
  otp: string;
};

export const forgetPasswordTrigger: AppRouteHandler<
  AppRequest<Record<string, never>, forgotPasswordRequestInputs>,
  AppResponse<forgotPasswordRequestResponse | ErrorResponse>
> = async (req, res) => {
  const { email } = req.body;

  const [user] = await db
    .select()
    .from(userTable)
    .where(eq(userTable.email, email))
    .limit(1);

  if (!user) {
    return res.status(HTTPStatusCode.NOT_FOUND).json({
      message: 'Given user not found',
    });
  }

  const expireMinutes = 10;
  const otp = generateOTP(6);

  await redisClient.set(
    `${forgetPasswordRequestRedisStoreKey}:${email}`,
    JSON.stringify({
      email,
      otp,
    }),
    'EX',
    expireMinutes * 60,
  );

  await sendEmail({
    toMail: email,
    subject: 'Password reset OTP',
    body: `OTP is ${otp}`,
  });

  return res.status(HTTPStatusCode.OK).json({
    email,
    otpDuration: expireMinutes * 60,
  });
};
