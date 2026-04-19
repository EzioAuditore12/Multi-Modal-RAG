import { defineRelations } from 'drizzle-orm';
import { projectFileTable } from '@/db/models/project-file.table';
import { projectFileEmbeddingTable } from '@/db/models/project-file-embedding.model';

export const projectFileToEmbeddingOneToOne = defineRelations(
  { projectFileTable, projectFileEmbeddingTable },
  (r) => ({
    projectFileTable: {
      embedding: r.one.projectFileEmbeddingTable({
        from: r.projectFileTable.id,
        to: r.projectFileEmbeddingTable.id,
      }),
    },
    projectFileEmbeddingTable: {
      projectFile: r.one.projectFileTable({
        from: r.projectFileEmbeddingTable.id,
        to: r.projectFileTable.id,
      }),
    },
  }),
);
