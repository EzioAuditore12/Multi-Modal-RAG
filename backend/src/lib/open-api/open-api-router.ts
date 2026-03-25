import express, { type Request, type Response, type Router } from 'express';

import { apiReference } from '@scalar/express-api-reference';

import { generateOpenAPIDocument } from './open-api-document-generator';

export const openAPIRouter: Router = express.Router();
const openAPIDocument = generateOpenAPIDocument();

openAPIRouter.get('/openapi.json', (_req: Request, res: Response) => {
  res.send(openAPIDocument);
});

openAPIRouter.use(
  '/api',
  apiReference({
    url: '/openapi.json',
  }),
);
