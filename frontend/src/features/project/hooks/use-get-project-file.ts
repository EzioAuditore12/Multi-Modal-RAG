import { useQuery } from '@tanstack/react-query';
import { getProjectFileApi } from '../api/get-project-file.api';

export function useGetProjectFile(id: string) {
  return useQuery({
    queryKey: ['project-file', id],
    queryFn: () => getProjectFileApi(id),
  });
}
