import { Request, RequestHandler, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { aiService } from '@/services/ai.service';
import { HumanMessage } from '@langchain/core/messages';

import { structurePromptOutput } from '@/utils/prompt';
import { aiArticleService } from '@/services/ai/ai-article.service';
import { ArticleGenerateRequest } from '@/schemas/ai/article/article-generate-request.schema';

export class AiController {}

export const aiController = new AiController();
