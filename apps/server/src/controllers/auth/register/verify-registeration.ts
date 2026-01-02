import type {
  AppRouteHandler,
  AppRequest,
  AppResponse,
  ErrorResponse,
} from '@/lib/types';
import { db } from '@/db';
import { eq } from 'drizzle-orm';
import { redisClient } from '@/lib/redis-client';
import { HTTPStatusCode } from '@/constants/http-status';
import { generateAuthToken } from '@/utils/jwt';

// Models
import { userTable } from '@/db/models/user.model';

// Request and Responses
import type {
  verifyRegisterInputs,
  verifyRegisterResponse,
} from '@/validations/auth/register/verify-registeration';

import {
  registerUserRedisKey,
  type registerUserStoredRedisType,
} from './register-user-form';

export const verifyRegisterationForm: AppRouteHandler<
  AppRequest<Record<string, never>, verifyRegisterInputs>,
  AppResponse<verifyRegisterResponse | ErrorResponse>
> = async (req, res) => {
  const { email, otp } = req.body;

  const redisValue = await redisClient.get(`${registerUserRedisKey}:${email}`);
  const storedRedisObject = redisValue
    ? (JSON.parse(redisValue) as registerUserStoredRedisType)
    : null;

  if (!storedRedisObject || email !== storedRedisObject.email) {
    return res.status(HTTPStatusCode.NOT_FOUND).json({
      message: 'No such request is found or expired',
    });
  }

  const [user] = await db
    .select()
    .from(userTable)
    .where(eq(userTable.email, email))
    .limit(1);

  if (user) {
    return res.status(HTTPStatusCode.CONFLICT).json({
      message: `User already exists with this ${user.email}`,
    });
  }

  if (otp !== Number(storedRedisObject.otp)) {
    return res.status(HTTPStatusCode.UNAUTHORIZED).json({
      message: 'Given otp is invalid',
    });
  }

  const [createUser] = await db
    .insert(userTable)
    .values({
      email: storedRedisObject.email,
      name: storedRedisObject.name,
      password: storedRedisObject.password,
      profilePicture: storedRedisObject.profilePicture ?? '',
    })
    .returning({
      id: userTable.id,
      email: userTable.email,
      name: userTable.name,
      profilePicture: userTable.profilePicture,
      createdAt: userTable.createdAt,
    });

  const tokens = generateAuthToken(createUser.id);

  return res.status(HTTPStatusCode.CREATED).json({
    user: createUser,
    tokens,
  });
};
