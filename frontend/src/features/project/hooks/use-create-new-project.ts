'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createNewProjectApi } from '../api/create-new-project.api';

export function useCreateNewProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createNewProjectApi,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['search-projects'] });

      alert(`Project ${data.name} created successfully`);
    },
    onError: (error) => {
      alert(error);
    },
  });
}
