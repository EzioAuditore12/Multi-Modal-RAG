import {
  type OpenAPIRegistry,
  OpenApiGeneratorV3,
} from '@asteasolutions/zod-to-openapi';
import { apiReference } from '@scalar/express-api-reference';
import type express from 'express';

export function configureOpenAPI(
  app: express.Application,
  registry: OpenAPIRegistry,
) {
  const generator = new OpenApiGeneratorV3(registry.definitions);

  const openApiSpec = generator.generateDocument({
    openapi: '3.0.0',
    info: {
      title: 'Talentify API',
      version: '1.0.0',
    },
  });

  app.get('/openapi.json', (_, res) => {
    res.json(openApiSpec);
  });

  app.use(
    '/reference',
    apiReference({
      url: '/openapi.json',
      theme: 'bluePlanet',
    }),
  );
}
