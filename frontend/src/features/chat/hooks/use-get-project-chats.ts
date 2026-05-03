import { useInfiniteQuery } from '@tanstack/react-query';

import { GetProjectChatsParam } from '../schemas/get-project-chats/param.schema';
import { getProjectChatsApi } from '../api/get-project-chats.api';

export const useGetProjectChats = ({
  pageSize,
  projectId,
  search,
}: Omit<GetProjectChatsParam, 'cursor'>) => {
  return useInfiniteQuery({
    queryKey: ['search-chats', projectId, search, pageSize],

    queryFn: ({ pageParam }: { pageParam: string | undefined }) =>
      getProjectChatsApi({ projectId, search, pageSize, cursor: pageParam }),

    initialPageParam: undefined,

    getNextPageParam: (lastPage) => {
      const lastProjectChat = lastPage?.[lastPage.length - 1];
      return lastProjectChat ? lastProjectChat.id : undefined;
    },
  });
};
