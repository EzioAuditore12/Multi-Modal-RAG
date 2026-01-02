import type { NextFunction, Request, Response } from 'express';
import { HTTPStatusCode } from '@/constants/http-status';
import { parseAccessToken } from '@/utils/jwt';
import { authrizationHeaderSchema } from '@/constants/helpers';

declare global {
  namespace Express {
    interface Request {
      accessToken: string;
      userId: string;
    }
  }
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(HTTPStatusCode.UNAUTHORIZED).json({
      message: 'Authorization Header is needed',
    });
    return;
  }

  const result = authrizationHeaderSchema.safeParse({
    authorization: authHeader,
  });

  if (!result.success) {
    res.status(HTTPStatusCode.UNAUTHORIZED).json({
      message: result.error.issues[0].message,
    });
    return;
  }

  const [, token] = authHeader.split(' ');
  const decoded = parseAccessToken(token);

  if (!decoded) {
    res.status(HTTPStatusCode.FORBIDDEN).json({
      message: 'Given token is invalid or expired',
    });
    return;
  }

  req.accessToken = token;
  req.userId = decoded.id;

  next();
};
