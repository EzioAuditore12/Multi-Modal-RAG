import type {
  AppRouteHandler,
  AppRequest,
  AppResponse,
  ErrorResponse,
} from '@/lib/types';
import { HTTPStatusCode } from '@/constants/http-status';
import { redisClient } from '@/lib/redis-client';
import { randomUUID } from 'node:crypto';

// models
import { userTable } from '@/db/models/user.model';

// Request and Responses
import {
  forgetPasswordRequestRedisStoreKey,
  type forgetPaswordRedisStorage,
} from './forgot-password-trigger';
import type {
  verifyForgetPasswordRequestInputs,
  verifyForgetPasswordRequestResponse,
} from '@/validations/auth/forget-password/verify-forget-password-request';
import { db } from '@/db';
import { eq } from 'drizzle-orm';

export const verifiedForgetPasswordRequestRedisKey = 'Verified-forget-request';
export type verifiedForgetPasswordRequestRedisStorage = {
  email: string;
  verifiedToken: string;
};

export const verifyForgetPasswordRequest: AppRouteHandler<
  AppRequest<Record<string, never>, verifyForgetPasswordRequestInputs>,
  AppResponse<verifyForgetPasswordRequestResponse | ErrorResponse>
> = async (req, res) => {
  const { email, otp } = req.body;

  const redisValue = await redisClient.get(
    `${forgetPasswordRequestRedisStoreKey}:${email}`,
  );

  if (!redisValue) {
    return res.status(HTTPStatusCode.NOT_FOUND).json({
      message: 'No such password reset request found',
    });
  }

  const stored = JSON.parse(redisValue) as forgetPaswordRedisStorage;

  const [user] = await db
    .select()
    .from(userTable)
    .where(eq(userTable.email, email));

  if (!user || !stored.email) {
    return res.status(HTTPStatusCode.NOT_FOUND).json({
      message: 'No user with such request is found',
    });
  }

  if (String(stored.otp) !== String(otp)) {
    return res.status(HTTPStatusCode.UNAUTHORIZED).json({
      message: 'Entered wrong OTP',
    });
  }

  const verifiedToken = randomUUID();
  const expireMinutes = 10;

  await redisClient.del(`${forgetPasswordRequestRedisStoreKey}:${email}`);

  await redisClient.set(
    `${verifiedForgetPasswordRequestRedisKey}:${email}`,
    JSON.stringify({
      email,
      verifiedToken,
    }),
    'EX',
    expireMinutes * 60,
  );

  return res.status(HTTPStatusCode.ACCEPTED).json({
    email,
    verifiedToken,
  });
};
