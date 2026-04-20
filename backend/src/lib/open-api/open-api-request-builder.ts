import type { z } from 'zod';

export function requestBody(schema: z.ZodTypeAny) {
  return {
    content: { 'application/json': { schema } },
  };
}

export function multiPartRequestForm(schema: z.ZodTypeAny) {
  return {
    content: { 'multipart/form-data': { schema } },
  };
}
