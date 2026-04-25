import {
  and,
  eq,
  asc,
  gt,
  ilike,
  cosineDistance,
  sql,
  desc,
} from 'drizzle-orm';
import type { Document } from '@langchain/core/documents';

import { db } from '@/db';
import {
  type Project,
  type ProjectInsert,
  projectTable,
} from '@/db/models/project.model';
import { projectSettingTable } from '@/db/models/project-settings.model';
import { ProjectFile, projectFileTable } from '@/db/models/project-file.table';
import {
  ProjectFileEmbedding,
  projectFileEmbeddingTable,
} from '@/db/models/project-file-embedding.model';
import { uploadToCloudinary } from '@/lib/cloudinary';

import {
  googleDocumentEmbeddingModel,
  googleQueryEmbeddingModel,
} from '@/ai/models/google.model';
import { Pagination } from '@/schemas/pagination.schema';
import { aiService } from './ai.service';

export class ProjectService {
  private readonly database = db;
  private readonly table = projectTable;
  private readonly projectSettingsTable = projectSettingTable;
  private readonly projectFileTable = projectFileTable;
  private readonly projectFileEmbeddingTable = projectFileEmbeddingTable;

  private readonly aiService = aiService;

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

  public async getProjectsOfUser(
    userId: string,
    pagination: Pagination,
  ): Promise<Project[]> {
    const { pageSize, cursor, search } = pagination;

    const conditions = [eq(this.table.userId, userId)];

    if (cursor) conditions.push(gt(this.table.id, cursor));

    if (search) conditions.push(ilike(this.table.name, `%${search}%`));

    return await this.database
      .select()
      .from(this.table)
      .where(and(...conditions))
      .orderBy(asc(this.table.id))
      .limit(pageSize);
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
          id: projectId,
          fileName: uploadedFile.original_filename,
          url: uploadedFile.url,
        })
        .returning()
        .then((res) => res[0]);

      return project;
    });

    return projectFile;
  }

  public async getProjectFileById(
    id: string,
  ): Promise<ProjectFile | undefined> {
    return await this.database
      .select()
      .from(this.projectFileTable)
      .where(eq(this.projectFileTable.id, id))
      .then((res) => res[0] ?? undefined);
  }

  public async createProjectFileEmbeddings(
    projectFileId: string,
    documents: Document[],
  ): Promise<void> {
    for (const doc of documents) {
      const embedding = await this.aiService.generateDocumentEmbedding([
        doc.pageContent,
      ]);

      await this.database.insert(this.projectFileEmbeddingTable).values({
        projectFileId,
        content: doc.pageContent,
        embedding: embedding[0],
        metaData: doc.metadata,
      });
    }
  }

  public async findSimiliarFromProjectFileEmbeddings(
    projectId: string,
    query: string,
  ): Promise<{ content: string; metaData: unknown; similarity: number }[]> {
    const queryEmbedding = await this.aiService.generateQueryEmbedding(query);

    const similarity = sql<number>`1 - (${cosineDistance(this.projectFileEmbeddingTable.embedding, queryEmbedding)})`;

    const relevantDocs = await this.database
      .select({
        content: this.projectFileEmbeddingTable.content,
        metaData: this.projectFileEmbeddingTable.metaData,
        similarity,
      })
      .from(this.projectFileEmbeddingTable)
      .orderBy((t) => desc(t.similarity))
      .where(eq(this.projectFileEmbeddingTable.projectFileId, projectId))
      .limit(5);

    return relevantDocs;
  }
}

export const projectService = new ProjectService();
