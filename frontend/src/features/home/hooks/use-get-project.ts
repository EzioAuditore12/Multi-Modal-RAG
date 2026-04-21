import { useQuery } from '@tanstack/react-query';
import { getProjectApi } from '../api/get-project.api';

export function useGetProject(id: string) {
  return useQuery({
    queryKey: ['project', id],
    queryFn: () => getProjectApi(id),
  });
}
