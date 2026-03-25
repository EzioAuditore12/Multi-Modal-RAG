import { Request, RequestHandler, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { aiService } from '@/services/ai.service';
import { HumanMessage } from '@langchain/core/messages';

import { structurePromptOutput } from '@/utils/prompt';
import { aiArticleService } from '@/services/ai/ai-article.service';
import { ArticleGenerateRequest } from '@/schemas/ai/article/article-generate-request.schema';

export class AiController {
  private readonly aiService = aiService;
  private readonly aiArticleService = aiArticleService;

  public test: RequestHandler = async (req: Request, res: Response) => {
    const result = await this.aiService.test();

    return res.status(StatusCodes.OK).json(result.content);
  };

  public agentBuilder: RequestHandler = async (req: Request, res: Response) => {
    const messages = [new HumanMessage({ content: 'div 3 by 0' })];

    const result = await this.aiService.agentBuilder().invoke({ messages });

    const formattedResponse = await structurePromptOutput({
      messages: result.messages,
      promptTemplate: {
        template: 'Here is your answer: {answer}',
        inputVariables: ['answer'],
      },
    });

    return res.status(StatusCodes.OK).send({ result: formattedResponse });
  };

  public generateArticle: RequestHandler = async (
    req: ArticleGenerateRequest,
    res: Response,
  ) => {
    const articleGeneraterInput = req.body;

    const result = await aiArticleService.generateArticle(
      articleGeneraterInput,
    );

    return res.status(StatusCodes.OK).send(result);
  };
}

export const aiController = new AiController();
