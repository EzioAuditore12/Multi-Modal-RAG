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
import {
  generateHashedPassword,
  validatePassword,
} from '@/utils/crypto-password';
import { generateAuthToken } from '@/utils/jwt';

// models
import { userTable } from '@/db/models/user.model';

// Request and Responses
import type {
  changePasswordRequestInputs,
  changePasswordRequestResponse,
} from '@/validations/auth/forget-password/change-password';
import {
  verifiedForgetPasswordRequestRedisKey,
  type verifiedForgetPasswordRequestRedisStorage,
} from './verify-forgot-password-request';

export const changePassword: AppRouteHandler<
  AppRequest<Record<string, never>, changePasswordRequestInputs>,
  AppResponse<changePasswordRequestResponse | ErrorResponse>
> = async (req, res) => {
  const { email, password, verifiedToken } = req.body;

  // Get the password reset request from Redis
  const redisValue = await redisClient.get(
    `${verifiedForgetPasswordRequestRedisKey}:${email}`,
  );

  if (!redisValue) {
    return res.status(HTTPStatusCode.NOT_FOUND).json({
      message:
        'No password reset request found for this email or is it authenticate',
    });
  }
  const storedRedisValue = JSON.parse(
    redisValue,
  ) as verifiedForgetPasswordRequestRedisStorage;

  if (
    storedRedisValue.email !== email ||
    storedRedisValue.verifiedToken !== verifiedToken
  ) {
    return res.status(HTTPStatusCode.NOT_FOUND).json({
      message:
        'No password reset request found for this email or is it authenticate',
    });
  }

  const [user] = await db
    .select()
    .from(userTable)
    .where(eq(userTable.email, email))
    .limit(1);

  if (!user) {
    return res.status(HTTPStatusCode.NOT_FOUND).json({
      message: 'User not found',
    });
  }

  const comparePasswords = await validatePassword(password, user.password);

  if (comparePasswords === true) {
    return res.status(HTTPStatusCode.CONFLICT).json({
      message: 'The entered password is similiar to previous one',
    });
  }

  const hashedPassword = await generateHashedPassword(password);

  const [updateUser] = await db
    .update(userTable)
    .set({ password: hashedPassword })
    .where(eq(userTable.email, email))
    .returning({
      id: userTable.id,
      name: userTable.name,
      email: userTable.email,
      profilePicture: userTable.profilePicture,
      createdAt: userTable.createdAt,
    });

  await redisClient.del(`${verifiedForgetPasswordRequestRedisKey}:${email}`);

  const tokens = generateAuthToken(updateUser.id);

  return res.status(HTTPStatusCode.ACCEPTED).json({
    user: updateUser,
    tokens,
  });
};
