import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { z } from 'zod';

export const HTTPStatusCode = StatusCodes;
export const HTTPReasonPhrase = ReasonPhrases;

export const conflictResponseSchema = z.object({
  message: z.string().default('Conflict'),
});

export const unauthorizedRequestSchema = z.object({
  message: z.string().default('Unauthroized'),
});

export const notFoundRequestSchema = z.object({
  message: z.string().default('Not Found'),
});
