import { useInfiniteQuery } from '@tanstack/react-query';

import { GetChatMessagesParam } from '../schemas/get-chat-messages/param.schema';
import { getChatMessagesApi } from '../api/get-chat-messages.api';

export const useGetChatMessages = ({ pageSize, chatId }: Omit<GetChatMessagesParam, 'cursor'>) => {
  return useInfiniteQuery({
    queryKey: ['messages', chatId, pageSize],

    //@ts-ignore
    queryFn: ({ pageParam }: { pageParam: string | undefined }) =>
      getChatMessagesApi({ chatId, pageSize, cursor: pageParam }),

    initialPageParam: undefined,

    getNextPageParam: (lastPage) => {
      const lastChatMessage = lastPage?.[lastPage.length - 1];
      return lastChatMessage ? lastChatMessage.id : undefined;
    },
  });
};
