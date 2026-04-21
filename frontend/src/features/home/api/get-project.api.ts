import { authenticatedTypedFetch } from '@/lib/auth-fetch';
import { projectSchema } from '../schemas/project.schema';

export const getProjectApi = async (id: string) => {
  return await authenticatedTypedFetch({
    url: `project/${id}`,
    method: 'GET',
    schema: projectSchema,
  });
};
