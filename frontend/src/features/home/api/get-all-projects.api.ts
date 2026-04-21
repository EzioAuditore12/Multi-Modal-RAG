import { authenticatedTypedFetch } from '@/lib/auth-fetch';
import { GetAllProjectsParam } from '../schemas/get-all-projects/param';
import { getAllProjectsResponseSchema } from '../schemas/get-all-projects/response.schema';

export const getAllProjectsApi = async (data: GetAllProjectsParam) => {
  // Remove undefined values from data
  const query = Object.fromEntries(Object.entries(data).filter(([_, v]) => v !== undefined));

  return await authenticatedTypedFetch({
    url: 'project',
    method: 'GET',
    query,
    schema: getAllProjectsResponseSchema,
  });
};
