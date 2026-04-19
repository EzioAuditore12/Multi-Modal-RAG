import { defineRelations } from 'drizzle-orm';

import { projectTable } from '@/db/models/project.model';
import { projectFileTable } from '@/db/models/project-file.table';

export const projectToProjectFileOneToMany = defineRelations(
  { projects: projectTable, projectFiles: projectFileTable },
  (r) => ({
    projectFiles: {
      project: r.one.projects({
        from: r.projectFiles.projectId,
        to: r.projects.id,
      }),
    },
    projects: {
      projectFiles: r.many.projectFiles(),
    },
  }),
);
