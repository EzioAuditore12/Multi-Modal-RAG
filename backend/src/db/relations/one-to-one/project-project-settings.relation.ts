import { defineRelations } from 'drizzle-orm';
import { projectTable } from '@/db/models/project.model';
import { projectSettingTable } from '@/db/models/project-settings.model';

export const projectToProjectSettingsOneToOne = defineRelations(
  { projectTable, projectSettingTable },
  (r) => ({
    projectTable: {
      projectSettings: r.one.projectSettingTable({
        from: r.projectTable.id,
        to: r.projectSettingTable.id,
      }),
    },
    projectSettingTable: {
      project: r.one.projectTable({
        from: r.projectSettingTable.id,
        to: r.projectTable.id,
      }),
    },
  }),
);
