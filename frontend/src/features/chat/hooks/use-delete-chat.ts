import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deleteChatApi } from '../api/delete-chat.api';

export function useDeleteChat() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteChatApi,
    onSuccess: (data) => {
      alert(data.result);

      queryClient.invalidateQueries({ queryKey: ['search-chats'] });
    },
    onError: (error) => {
      alert(error);
    },
  });
}
