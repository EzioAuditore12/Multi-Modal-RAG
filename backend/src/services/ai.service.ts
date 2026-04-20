import { projectService } from './project.service';
import { userService } from './user.service';

import { ragIngestionService } from './rag/injestion.service';

export class AiService {
  private readonly userService = userService;
  private readonly projectService = projectService;
  private readonly ragIngestionService = ragIngestionService;
}

export const aiService = new AiService();
