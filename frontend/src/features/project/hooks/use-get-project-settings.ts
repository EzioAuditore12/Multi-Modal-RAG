import { useQuery } from '@tanstack/react-query';

import { getProjectSettingsApi } from '../api/get-project-settings.api';

export function useGetProjectSettings(id: string) {
  return useQuery({
    queryKey: ['project-settings', id],
    queryFn: () => getProjectSettingsApi(id),
  });
}
