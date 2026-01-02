import type {
  AppRequest,
  AppResponse,
  AppRouteHandler,
  ErrorResponse,
} from '@/lib/types';
import { db } from '@/db';
import { type userSelectResponse, userTable } from '@/db/models/user.model';
import { eq } from 'drizzle-orm';
import { HTTPStatusCode } from '@/constants/http-status';

export const getUserProfile: AppRouteHandler<
  AppRequest<Record<string, never>, Record<string, never>>,
  AppResponse<userSelectResponse | ErrorResponse>
> = async (req, res) => {
  const userId = req.userId;

  const [user] = await db
    .select()
    .from(userTable)
    .where(eq(userTable.id, userId))
    .limit(1);
  if (!user) {
    return res.status(HTTPStatusCode.NOT_FOUND).json({
      message: 'User not found',
    });
  }
  const { password: _, ...userData } = user;
  return res.status(HTTPStatusCode.OK).json(userData);
};
