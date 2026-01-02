import { HTTPStatusCode } from '@/constants/http-status';
import { db } from '@/db';
import type {
  AppRouteHandler,
  AppRequest,
  AppResponse,
  ErrorResponse,
} from '@/lib/types';
import { validatePassword } from '@/utils/crypto-password';
import { generateAuthToken } from '@/utils/jwt';
import { eq } from 'drizzle-orm';

// models
import { userTable } from '@/db/models/user.model';

// Requests and Response
import type {
  userLoginInputs,
  userLoginResponse,
} from '@/validations/auth/login/login-form';

export const loginUserForm: AppRouteHandler<
  AppRequest<Record<string, never>, userLoginInputs>,
  AppResponse<userLoginResponse | ErrorResponse>
> = async (req, res) => {
  const { email, password } = req.body;

  const [user] = await db
    .select()
    .from(userTable)
    .where(eq(userTable.email, email));

  if (!user) {
    return res.status(HTTPStatusCode.NOT_FOUND).json({
      message: 'Given user does not exist',
    });
  }

  const isValidatePassword = await validatePassword(password, user.password);

  if (!isValidatePassword) {
    return res.status(HTTPStatusCode.UNAUTHORIZED).json({
      message: 'Either entered password or email is wrong',
    });
  }

  const tokens = generateAuthToken(user.id);

  // Exclude password from user data
  const { password: _, ...userData } = user;

  return res.json({
    user: userData,
    tokens,
  });
};
