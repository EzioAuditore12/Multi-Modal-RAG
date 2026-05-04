import { authenticatedTypedFetch } from '@/lib/auth-fetch';

import { projectSettingSchema } from '../schemas/project-settings.schema';

export const getProjectSettingsApi = async (id: string) => {
  return await authenticatedTypedFetch({
    url: `project/project-settings/${id}`,
    method: 'GET',
    schema: projectSettingSchema,
  });
};
