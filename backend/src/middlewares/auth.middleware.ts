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
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer '))
    throw new UnauthenticatedError('Missing or invalid Authorization header');

  const token = authHeader.split(' ')[1];
  const decoded = await jwt.parseAccessToken(token);

  if (!decoded) {
    throw new UnauthenticatedError('Invalid or expired token');
  }

  // Attach user info to request object if needed
  req.user = { id: decoded.sub };

  next();
}
