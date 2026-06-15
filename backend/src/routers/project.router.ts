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
  projectFileBodySchema,
  projectFileParamsSchema,
} from '@/schemas/project/file/request.schema';
import { getAllProjectsSchema } from '@/schemas/project/get-all.schema';
import { projectSchema } from '@/db/models/project.model';
import { projectFileSchema } from '@/db/models/project-file.table';
import {
  updateProjectSettingParamSchema,
  updateProjectSettingSchema,
} from '@/schemas/project/settings/request.schema';
import { projectSettingSchema } from '@/db/models/project-settings.model';

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
  method: 'get',
  path: '/project',
  tags: TAGS,
  request: {
    query: getAllProjectsSchema,
  },
  responses: createApiResponse(projectSchema.array(), 'Success'),
});

projectRouter.get(
  '/',
  //@ts-ignores
  validate({ query: getAllProjectsSchema }),
  authMiddleware,
  projectController.getAll,
);

projectRegistry.registerPath({
  method: 'get',
  path: '/project/{id}',
  tags: TAGS,
  request: {
    params: z.object({ id: z.uuid() }),
  },
  responses: createApiResponse(projectSchema, 'Success'),
});

projectRouter.get(
  '/:id',
  validate({ params: z.object({ id: z.uuid() }) }),
  projectController.getById,
);

projectRegistry.registerPath({
  method: 'get',
  path: '/project/project-file/{id}',
  tags: TAGS,
  request: {
    params: projectFileParamsSchema,
  },
  responses: createApiResponse(projectFileSchema.optional(), 'Success'),
});

projectRouter.get(
  '/project-file/:id',
  validate({
    params: projectFileParamsSchema,
  }),
  authMiddleware,
  projectController.getProjectFileById,
);

projectRegistry.registerPath({
  method: 'get',
  path: '/project/project-file/{id}/status',
  tags: TAGS,
  request: {
    params: projectFileParamsSchema,
  },
  responses: createApiResponse(z.any(), 'Success'),
});

projectRouter.get(
  '/project-file/:id/status',
  validate({
    params: projectFileParamsSchema,
  }),
  authMiddleware,
  projectController.getUploadStatus,
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
  uploadSingle,
  validate({
    params: projectFileParamsSchema,
    body: projectFileBodySchema,
  }),
  authMiddleware,
  projectController.uploadProjectFile,
);

projectRegistry.registerPath({
  method: 'patch',
  path: '/project/project-settings/{id}',
  tags: TAGS,
  request: {
    params: updateProjectSettingParamSchema,
    body: requestBody(updateProjectSettingSchema),
  },
  responses: createApiResponse(projectSettingSchema, 'Success'),
});

projectRouter.patch(
  '/project-settings/:id',
  validate({
    params: updateProjectSettingParamSchema,
    body: updateProjectSettingSchema,
  }),
  authMiddleware,
  projectController.updateSettings,
);

projectRegistry.registerPath({
  method: 'get',
  path: '/project/project-settings/{id}',
  tags: TAGS,
  request: {
    params: z.object({ id: z.uuid() }),
  },
  responses: createApiResponse(projectSettingSchema, 'Success'),
});

projectRouter.get(
  '/project-settings/:id',
  validate({
    params: z.object({ id: z.uuid() }),
  }),
  authMiddleware,
  projectController.getSettingsById,
);
