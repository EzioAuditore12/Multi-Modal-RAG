import { Request, RequestHandler, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { aiService } from "@/services/ai.service";
import { HumanMessage } from "@langchain/core/messages";

export class AiController {
  private readonly aiService = aiService;

  public test: RequestHandler = async (req: Request, res: Response) => {
    const result = await this.aiService.test();

    return res.status(StatusCodes.OK).json(result.content);
  };

  public agentBuilder: RequestHandler = async (req: Request, res: Response) => {
    const messages = [new HumanMessage({ content: "Mul 3 and 4" })];

    const result = await this.aiService.agentBuilder().invoke({ messages });

    return res.status(StatusCodes.OK).send(result.messages);
  };
}

export const aiController = new AiController();
