import { useMutation, useQueryClient } from '@tanstack/react-query';

import { updateProjectSettingsApi } from '../api/update-project-settings.api';

export function useUpdateProjectSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProjectSettingsApi,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['project-settings', data.id] });

      alert('Project Updated successfully');
    },
    onError: (error) => {
      alert(error);
    },
  });
}
