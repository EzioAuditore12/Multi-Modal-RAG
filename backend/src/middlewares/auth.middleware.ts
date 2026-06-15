import type { Request, Response, NextFunction } from 'express';
import { UnauthenticatedError } from 'express-error-toolkit';

import { jwt } from '@/utils/jwt';

declare module 'express' {
  interface Request {
    user?: { id: string };
  }
}

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const token = req.cookies.accessToken;

  if (!token)
    throw new UnauthenticatedError('Missing or invalid Authorization token');

  const decoded = await jwt.parseAccessToken(token);

  if (!decoded) {
    throw new UnauthenticatedError('Invalid or expired token');
  }

  // Attach user info to request object if needed
  req.user = { id: decoded.sub };

  next();
}
