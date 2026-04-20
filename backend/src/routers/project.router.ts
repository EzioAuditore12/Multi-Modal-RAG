import express, { type Router } from 'express';
import validate from 'express-zod-safe';
import { z } from 'zod';

import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { createApiResponse } from '@/lib/open-api/open-api-response-builder';

import { authMiddleware } from '@/middlewares/auth.middleware';

import { projectController } from '@/controllers/project.controller';
import { createProjectSchema } from '@/schemas/project/create.schema';
import { uploadSingle } from '@/middlewares/multer.middleware';
import { createProjectResponseSchema } from '@/schemas/project/response.schema';
import {
  multiPartRequestForm,
  requestBody,
} from '@/lib/open-api/open-api-request-builder';
import { uploadProjectFileResponseSchema } from '@/schemas/project/file/response.schema';
import {
  projectFileEmbeddingBodySchema,
  projectFileEmbeddingParamsSchema,
} from '@/schemas/project/embeddings/request.schema';
import {
  projectFileBodySchema,
  projectFileParamsSchema,
} from '@/schemas/project/file/request.schema';

export const projectRegistry = new OpenAPIRegistry();
export const projectRouter: Router = express.Router();

const TAGS = ['Project'];

projectRegistry.registerPath({
  method: 'post',
  path: '/project',
  tags: TAGS,
  request: {
    body: requestBody(createProjectSchema),
  },
  responses: createApiResponse(createProjectResponseSchema, 'Success'),
});

projectRouter.post(
  '/',
  validate({ body: createProjectSchema }),
  authMiddleware,
  projectController.create,
);

projectRegistry.registerPath({
  method: 'post',
  path: '/project/project-file/{id}',
  tags: TAGS,
  request: {
    params: projectFileParamsSchema,
    body: multiPartRequestForm(projectFileBodySchema),
  },
  responses: createApiResponse(uploadProjectFileResponseSchema, 'Success'),
});

projectRouter.post(
  '/project-file/:id',
  validate({
    params: projectFileParamsSchema,
    body: projectFileBodySchema,
  }),
  authMiddleware,
  uploadSingle,
  projectController.uploadProjectFile,
);

projectRegistry.registerPath({
  method: 'post',
  path: '/project/project-file-embedding/{id}',
  tags: TAGS,
  request: {
    params: projectFileEmbeddingParamsSchema,
    body: requestBody(projectFileEmbeddingBodySchema),
  },
  responses: createApiResponse(z.null(), 'Success'),
});

projectRouter.post(
  '/project-file-embedding/:id',
  validate({
    params: projectFileEmbeddingParamsSchema,
    body: projectFileEmbeddingBodySchema,
  }),
  // authMiddleware,
  projectController.createProjectFileEmbeddings,
);
