import { defineRelations } from 'drizzle-orm';

import { chatTable } from '@/db/models/chat.model';
import { messageTable } from '@/db/models/message.model';

export const chatToMessageOneToMany = defineRelations(
  { chats: chatTable, messages: messageTable },
  (r) => ({
    messages: {
      chat: r.one.chats({
        from: r.messages.chatId,
        to: r.chats.id,
      }),
    },
    chats: {
      messages: r.many.messages(),
    },
  }),
);
