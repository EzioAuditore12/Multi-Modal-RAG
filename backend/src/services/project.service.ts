import fs from 'node:fs';

import { and, eq } from 'drizzle-orm';
import type { Document } from '@langchain/core/documents';

import { db } from '@/db';
import {
  type Project,
  type ProjectInsert,
  projectTable,
} from '@/db/models/project.model';
import { projectSettingTable } from '@/db/models/project-settings.model';
import { ProjectFile, projectFileTable } from '@/db/models/project-file.table';
import { projectFileEmbeddingTable } from '@/db/models/project-file-embedding.model';
import { uploadToCloudinary } from '@/lib/cloudinary';

import { googleDocumentEmbeddingModel } from '@/ai/models/google.model';

export class ProjectService {
  private readonly database = db;
  private readonly table = projectTable;
  private readonly projectSettingsTable = projectSettingTable;
  private readonly projectFileTable = projectFileTable;
  private readonly projectFileEmbeddingTable = projectFileEmbeddingTable;

  private readonly embeddingDocumentModel = googleDocumentEmbeddingModel;

  public async create(insertProject: ProjectInsert): Promise<Project> {
    return await this.database.transaction(async (trx) => {
      const project = await trx
        .insert(this.table)
        .values(insertProject)
        .returning()
        .then((res) => res[0]);

      await trx.insert(this.projectSettingsTable).values({
        id: project.id,
      });

      return project;
    });
  }

  public async findById(id: string): Promise<Project | undefined> {
    return await this.database
      .select()
      .from(this.table)
      .where(eq(this.table.id, id))
      .then((res) => res[0] ?? undefined);
  }

  public async findByIdAndIsAuthenticatedUser(id: string, userId: string) {
    const project = await this.database
      .select()
      .from(this.table)
      .where(and(eq(this.table.id, id), eq(this.table.userId, userId)))
      .then((res) => res[0]);
    return !!project;
  }

  public async findByNameWithUserId(
    userId: string,
    name: string,
  ): Promise<Project | undefined> {
    return await this.database
      .select()
      .from(this.table)
      .where(and(eq(this.table.name, name), eq(this.table.userId, userId)))
      .then((res) => res[0] ?? undefined);
  }

  public async createProjectFile(
    projectId: string,
    file: Express.Multer.File,
  ): Promise<ProjectFile> {
    const { filename, path } = file;

    const projectFile = await this.database.transaction(async (transaction) => {
      const uploadedFile = await uploadToCloudinary(path, filename);

      console.log(uploadedFile);

      const project = await transaction
        .insert(this.projectFileTable)
        .values({
          projectId,
          filename: uploadedFile.original_filename,
          url: uploadedFile.url,
        })
        .returning()
        .then((res) => res[0]);

      return project;
    });

    await fs.promises.unlink(path);

    return projectFile;
  }

  public async getProjectFileById(id: bigint): Promise<ProjectFile> {
    return await this.database
      .select()
      .from(this.projectFileTable)
      .where(eq(this.projectFileTable.id, id))
      .then((res) => res[0]);
  }

  public async createProjectFileEmbeddings(
    projectFileId: bigint,
    documents: Document[],
  ): Promise<void> {
    for (const doc of documents) {
      const embedding = await this.embeddingDocumentModel.embedDocuments([
        doc.pageContent,
      ]);

      await this.database.insert(this.projectFileEmbeddingTable).values({
        id: projectFileId,
        content: doc.pageContent,
        embedding: embedding[0],
        metaData: doc.metadata,
      });
    }
  }
}

export const projectService = new ProjectService();
