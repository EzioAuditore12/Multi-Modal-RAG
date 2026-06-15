import fs from 'node:fs';

import { Response, Request } from 'express';
import { ConflictError, NotFoundError } from 'express-error-toolkit';
import { StatusCodes } from 'http-status-codes';
import { createSession } from 'better-sse';

import { getUploadChannel } from '@/lib/channels/upload-status.channel';
import { CreateProjectRequest } from '@/schemas/project/create.schema';
import { projectService } from '@/services/project.service';
import { ProjectFileRequest } from '@/schemas/project/file/request.schema';
import { ragIngestionService } from '@/services/rag/injestion.service';
import { GetAllProjectsRequest } from '@/schemas/project/get-all.schema';
import { UpdateProjectSettingsRequest } from '@/schemas/project/settings/request.schema';

export class ProjectController {
  private readonly projectService = projectService;
  private readonly ragIngestionService = ragIngestionService;

  public getUploadStatus = async (req: Request, res: Response) => {
    const projectId = req.params.id as string;
    const session = await createSession(req, res);

    const isAuthenticedUserAndExisitingProject =
      await this.projectService.findByIdAndIsAuthenticatedUser(
        projectId,
        req.user?.id!,
      );

    if (!isAuthenticedUserAndExisitingProject) {
      session.push('Unauthorized', 'error');
      res.end();
      return;
    }

    const channel = getUploadChannel(projectId);
    channel.register(session);
  };

  public create = async (req: CreateProjectRequest, res: Response) => {
    const userId = req.user?.id!;

    const { name, description } = req.body;

    const existingProject = await this.projectService.findByNameWithUserId(
      userId,
      name,
    );

    if (existingProject)
      throw new ConflictError(
        'Project with this name already exists in your projects',
      );

    const result = await this.projectService.create({
      userId,
      name,
      description,
    });

    return res.status(StatusCodes.CREATED).send(result);
  };

  public getAll = async (req: GetAllProjectsRequest, res: Response) => {
    const userId = req.user?.id!;

    const query = req.query;

    const response = await this.projectService.getProjectsOfUser(userId, query);

    return res.status(StatusCodes.OK).send(response);
  };

  public getById = async (req: Request, res: Response) => {
    const projectId = req.params.id as string;

    const response = await this.projectService.findById(projectId);

    return res.status(StatusCodes.OK).send(response);
  };

  public updateSettings = async (
    req: UpdateProjectSettingsRequest,
    res: Response,
  ) => {
    const userId = req.user?.id!;
    const projectId = req.params.id;

    const { embeddingModel, ragStrategy, reRankingModel } = req.body;

    const existingProject =
      await this.projectService.findByIdAndIsAuthenticatedUser(
        projectId,
        userId,
      );

    if (!existingProject)
      throw new NotFoundError(`No such project with ${projectId} found`);

    const response = await this.projectService.updateSettings(projectId, {
      embeddingModel,
      ragStrategy,
      reRankingModel,
    });

    return res.status(StatusCodes.ACCEPTED).send(response);
  };

  public getSettingsById = async (req: Request, res: Response) => {
    const userId = req.user?.id!;
    const projectId = req.params.id as string;

    const existingProject =
      await this.projectService.findByIdAndIsAuthenticatedUser(
        projectId,
        userId,
      );

    if (!existingProject)
      throw new NotFoundError(`No such project with ${projectId} found`);

    const response = await this.projectService.getSettings(projectId);

    return res.status(StatusCodes.OK).send(response);
  };

  public getProjectFileById = async (req: Request, res: Response) => {
    const userId = req.user?.id!;
    const projectId = req.params.id as string;

    const existingProject =
      await this.projectService.findByIdAndIsAuthenticatedUser(
        projectId,
        userId,
      );

    if (!existingProject)
      throw new NotFoundError(`No such project with ${projectId} found`);

    const projectFile = await this.projectService.getProjectFileById(projectId);

    return res.status(StatusCodes.ACCEPTED).send(projectFile);
  };

  public uploadProjectFile = async (req: ProjectFileRequest, res: Response) => {
    const userId = req.user?.id!;
    const projectId = req.params.id as string;
    const file = req.file!;

    const existingProject =
      await this.projectService.findByIdAndIsAuthenticatedUser(
        projectId,
        userId,
      );

    if (!existingProject)
      throw new NotFoundError(`No such project with ${projectId} found`);

    const existingProjectFile =
      await this.projectService.getProjectFileById(projectId);

    if (existingProjectFile) {
      fs.rmSync(file.path);
      throw new NotFoundError(`Project file already uploaded`);
    }

    if (!existingProject) {
      fs.rmSync(file.path);
      throw new NotFoundError(
        `No Project with exists or you are not authenticated to view or modify the project`,
      );
    }
    const projectFile = await this.projectService.createProjectFile(
      projectId,
      file,
    );

    const channel = getUploadChannel(projectId);

    try {
      channel.broadcast(
        'File uploaded successfully. Starting processing...',
        'status',
      );

      const documents = await this.ragIngestionService.processDocuments(
        file.path,
        (msg) => {
          channel.broadcast(msg, 'status');
        },
      );

      channel.broadcast('Creating embeddings...', 'status');
      await this.projectService.createProjectFileEmbeddings(
        projectId,
        documents,
      );

      channel.broadcast('Done!', 'status');
    } catch (error: any) {
      channel.broadcast(`Error: ${error.message}`, 'error');
      throw error;
    } finally {
      await fs.promises.unlink(file.path);
    }

    return res.status(StatusCodes.CREATED).send(projectFile);
  };
}

export const projectController = new ProjectController();
