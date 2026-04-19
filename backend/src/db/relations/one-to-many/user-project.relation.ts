import { defineRelations } from 'drizzle-orm';

import { userTable } from '@/db/models/user.model';
import { projectTable } from '@/db/models/project.model';

export const userToProjectOneToMany = defineRelations(
  { users: userTable, projects: projectTable },
  (r) => ({
    projects: {
      project: r.one.users({
        from: r.projects.userId,
        to: r.users.id,
      }),
    },
    users: {
      projects: r.many.projects(),
    },
  }),
);
