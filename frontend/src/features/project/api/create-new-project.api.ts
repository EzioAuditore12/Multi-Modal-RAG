import { authenticatedTypedFetch } from '@/lib/auth-fetch';

import type { CreateNewProjectParam } from '../schemas/create-new-project/param.schema';
import { createNewProjectResponseSchema } from '../schemas/create-new-project/response.schema';

export const createNewProjectApi = async (data: CreateNewProjectParam) => {
  return await authenticatedTypedFetch({
    url: 'project',
    method: 'POST',
    body: data,
    schema: createNewProjectResponseSchema,
  });
};
