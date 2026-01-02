import type { Request, Response, NextFunction } from 'express';
import { HTTPStatusCode } from '@/constants/http-status';
import multer from 'multer';
import type { ZodError } from 'zod';

export function errorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  // Log the error for debugging
  console.error('Error occurred:', error);

  // Handle Multer errors
  if (error instanceof multer.MulterError) {
    switch (error.code) {
      case 'LIMIT_FILE_SIZE':
        return res.status(HTTPStatusCode.BAD_REQUEST).json({
          error: 'File too large',
          message: 'The uploaded file exceeds the size limit',
          details: [
            {
              field: 'file',
              message: error.message,
            },
          ],
        });
      case 'LIMIT_UNEXPECTED_FILE':
        return res.status(HTTPStatusCode.BAD_REQUEST).json({
          error: 'Invalid file',
          message: 'Invalid file type or unexpected file field',
          details: [
            {
              field: 'file',
              message: error.message,
            },
          ],
        });
      default:
        return res.status(HTTPStatusCode.BAD_REQUEST).json({
          error: 'File upload error',
          message: error.message,
          details: [
            {
              field: 'file',
              message: error.message,
            },
          ],
        });
    }
  }

  // Handle Zod validation errors
  if (
    error &&
    typeof error === 'object' &&
    'name' in error &&
    error.name === 'ZodError'
  ) {
    const zodError = error as ZodError;
    return res.status(HTTPStatusCode.BAD_REQUEST).json({
      error: 'Validation failed',
      message: 'Please check the following fields and try again',
      details: zodError.issues.map((err) => ({
        field: err.path.join('.') || 'unknown',
        message: err.message,
      })),
    });
  }

  // Handle database errors
  if (error && typeof error === 'object' && 'code' in error) {
    const dbError = error as { code: string };
    if (dbError.code === 'ECONNREFUSED' || dbError.code === '23505') {
      return res.status(HTTPStatusCode.SERVICE_UNAVAILABLE).json({
        error: 'Database error',
        message: 'Unable to process your request at this time',
        details: [
          {
            field: '',
            message: 'Database connection issue',
          },
        ],
      });
    }
  }

  // Handle JWT errors
  if (
    error &&
    typeof error === 'object' &&
    'name' in error &&
    'message' in error &&
    error.name === 'JsonWebTokenError'
  ) {
    const jwtError = error as { message: string };
    return res.status(HTTPStatusCode.UNAUTHORIZED).json({
      error: 'Authentication error',
      message: 'Invalid or expired token',
      details: [
        {
          field: 'authorization',
          message: jwtError.message,
        },
      ],
    });
  }

  // Handle custom application errors
  if (
    error &&
    typeof error === 'object' &&
    'status' in error &&
    'message' in error
  ) {
    const appError = error as {
      status: number;
      message: string;
      name?: string;
    };
    return res.status(appError.status).json({
      error: appError.name || 'Application error',
      message: appError.message,
      details: [
        {
          field: '',
          message: appError.message,
        },
      ],
    });
  }

  // Default error response
  return res.status(HTTPStatusCode.INTERNAL_SERVER_ERROR).json({
    error: 'Internal server error',
    message: 'Something went wrong on our end',
    details: [
      {
        field: '',
        message: 'Please try again later',
      },
    ],
  });
}
