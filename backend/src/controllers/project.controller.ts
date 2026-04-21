import fs from 'node:fs';

import { RequestHandler, Response, Request } from 'express';
import { ConflictError, NotFoundError } from 'express-error-toolkit';
import { StatusCodes } from 'http-status-codes';

import { CreateProjectRequest } from '@/schemas/project/create.schema';
import { projectService } from '@/services/project.service';
import { uploadProjectFileResponseSchema } from '@/schemas/project/file/response.schema';
import { ProjectFileEmbeddingRequest } from '@/schemas/project/embeddings/request.schema';
import { ProjectFileRequest } from '@/schemas/project/file/request.schema';
import { ragIngestionService } from '@/services/rag/injestion.service';
import { GetAllProjectsRequest } from '@/schemas/project/get-all.schema';

export class ProjectController {
  private readonly projectService = projectService;
  private readonly ragIngestionService = ragIngestionService;

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

  public uploadProjectFile = async (req: ProjectFileRequest, res: Response) => {
    const userId = req.user?.id!;
    const projectId = req.params.id as string;
    const file = req.file!;

    const existingProject =
      await this.projectService.findByIdAndIsAuthenticatedUser(
        projectId,
        userId,
      );

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
    const result = await this.projectService.createProjectFile(projectId, file);

    const response = uploadProjectFileResponseSchema.strip().parse(result);

    return res.status(StatusCodes.CREATED).send(response);
  };

  public createProjectFileEmbeddings = async (
    req: ProjectFileEmbeddingRequest,
    res: Response,
  ) => {
    const userId = req.user?.id!;
    const { id: projectId } = req.params;

    const existingProject =
      await this.projectService.findByIdAndIsAuthenticatedUser(
        projectId,
        userId,
      );

    if (!existingProject)
      throw new NotFoundError(
        `No Project with exists or you are not authenticated to view or modify the project`,
      );
  };
}

export const projectController = new ProjectController();
