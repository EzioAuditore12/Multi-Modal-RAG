import { authenticatedTypedFetch } from '@/lib/auth-fetch';

import { UpdateProjectSettingsParamSchema } from '../schemas/update-project-settings/param.schema';
import { updateProjectSettingResponseSchema } from '../schemas/update-project-settings/response.schema';

export const updateProjectSettingsApi = async (data: UpdateProjectSettingsParamSchema) => {
  const { id, ...rest } = data;

  return await authenticatedTypedFetch({
    url: `project/project-settings/${id}`,
    method: 'PATCH',
    body: rest,
    schema: updateProjectSettingResponseSchema,
  });
};
