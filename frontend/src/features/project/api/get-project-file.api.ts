import { authenticatedTypedFetch } from '@/lib/auth-fetch';
import { projectFileSchema } from '../schemas/project-file.schema';

export const getProjectFileApi = async (id: string) => {
  return await authenticatedTypedFetch({
    url: `project/project-file/${id}`,
    method: 'GET',
    schema: projectFileSchema.optional(),
  });
};
