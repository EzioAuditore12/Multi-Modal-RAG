import { defineRelations } from 'drizzle-orm';

import { projectTable } from '@/db/models/project.model';
import { chatTable } from '@/db/models/chat.model';

export const projectToChatOneToMany = defineRelations(
  { projects: projectTable, chats: chatTable },
  (r) => ({
    chats: {
      project: r.one.projects({
        from: r.chats.projectId,
        to: r.projects.id,
      }),
    },
    projects: {
      chats: r.many.chats(),
    },
  }),
);
