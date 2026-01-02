import { HTTPStatusCode } from '@/constants/http-status';
import type {
  AppRouteHandler,
  AppRequest,
  AppResponse,
  ErrorResponse,
} from '@/lib/types';
import { parseRefreshToken, generateAuthToken } from '@/utils/jwt';
import { db } from '@/db';
import { eq } from 'drizzle-orm';

// Tables
import { userTable } from '@/db/models/user.model';
import { blackListedRefreshTokenTable } from '@/db/models/blacklisted-refresh-token';

// Requests and Response
import type {
  regenerateTokenInputs,
  regenerateTokenResponse,
} from '@/validations/auth/tokens/regenerate-tokens';

export const regenerateTokens: AppRouteHandler<
  AppRequest<Record<string, never>, regenerateTokenInputs>,
  AppResponse<regenerateTokenResponse | ErrorResponse>
> = async (req, res) => {
  const { oldRefreshToken } = req.body;

  const oldDecodedRefreshToken = parseRefreshToken(oldRefreshToken);

  if (!oldDecodedRefreshToken)
    return res.status(HTTPStatusCode.UNAUTHORIZED).json({
      message: 'Given token is invalid or expired',
    });

  const userId = oldDecodedRefreshToken.id;

  const [user] = await db
    .select()
    .from(userTable)
    .where(eq(userTable.id, userId))
    .limit(1);

  if (!user) {
    console.log(user);
    return res.status(HTTPStatusCode.NOT_FOUND).json({
      message: 'No such user exists',
    });
  }

  await db.insert(blackListedRefreshTokenTable).values({
    userId: user.id,
    refresh_token: oldRefreshToken,
    createdAt: new Date(oldDecodedRefreshToken.iat * 1000),
    expiredAt: new Date(oldDecodedRefreshToken.exp * 1000),
  });

  const tokens = generateAuthToken(user.id);

  const { password: _, ...userData } = user;

  return res.status(HTTPStatusCode.OK).json({
    user: userData,
    tokens,
  });
};
