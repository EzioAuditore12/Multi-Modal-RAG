import { useInfiniteQuery } from '@tanstack/react-query';
import { GetAllProjectsParam } from '../schemas/get-all-projects/param';
import { getAllProjectsApi } from '../api/get-all-projects.api';

export function useGetAllProjects({ pageSize, search }: Omit<GetAllProjectsParam, 'cursor'>) {
  return useInfiniteQuery({
    queryKey: ['search-projects', search, pageSize],

    //@ts-ignore
    queryFn: ({ pageParam }) =>
      //@ts-ignore
      getAllProjectsApi({ search, pageSize, cursor: pageParam as string }),

    initialPageParam: undefined,

    getNextPageParam: (lastPage) => {
      const lastProject = lastPage?.[lastPage.length - 1];
      return lastProject ? lastProject.id : undefined;
    },
  });
}
