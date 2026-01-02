import { z, type ZodObject } from 'zod';
import validator from 'validator';

export const jsonContent = (schema: ZodObject) => ({
  content: {
    'application/json': {
      schema,
    },
  },
});

export const formDataContent = (schema: ZodObject) => ({
  content: {
    'multipart/form-data': {
      schema,
    },
  },
});

export const authorizationTokens = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
});

export const authrizationHeaderSchema = z.object({
  authorization: z.string().refine(
    (val) => {
      const [scheme, token] = val.split(' ');
      return scheme === 'Bearer' && validator.isJWT(token);
    },
    {
      error:
        "Authorization header must be in format 'Bearer <JWT>' and JWT must be valid",
    },
  ),
});

export const imageSchema = z
  .instanceof(File)
  .refine(
    (file) =>
      [
        'image/png',
        'image/jpeg',
        'image/jpg',
        'image/svg+xml',
        'image/gif',
      ].includes(file.type),
    {
      error: 'Invalid image file type',
    },
  );
