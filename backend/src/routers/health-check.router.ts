import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import express, { type Request, type Response, type Router } from 'express';
import { z } from 'zod';

import { createApiResponse } from '@/lib/open-api/open-api-response-builder';
import { ServiceResponse } from '@/utils/service-response';

export const healthCheckRegistry = new OpenAPIRegistry();
export const healthCheckRouter: Router = express.Router();

healthCheckRegistry.registerPath({
  method: 'get',
  path: '/health-check',
  tags: ['Health Check'],
  responses: createApiResponse(z.null(), 'Success'),
  security: [],
});

healthCheckRouter.get('/', (_req: Request, res: Response) => {
  const serviceResponse = ServiceResponse.success('Service is healthy', null);
  res.status(serviceResponse.statusCode).send(serviceResponse);
});
