import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { CreateNewChatRequest } from '@/schemas/chat/new/request';
import { CreateNewChatResponse } from '@/schemas/chat/new/response.schema';
import { aiService } from '@/services/ai.service';
import { chatService } from '@/services/chat.service';
import { projectService } from '@/services/project.service';

export class ChatController {
  private readonly aiService = aiService;
  private readonly chatService = chatService;
  private readonly projectService = projectService;

  public createNewChat = async (req: CreateNewChatRequest, res: Response) => {
    const userId = req.user?.id!;
    const { projectId, query } = req.body;

    const isAuthenticedUserAndExisitingProject =
      await this.projectService.findByIdAndIsAuthenticatedUser(
        projectId,
        userId,
      );

    if (!isAuthenticedUserAndExisitingProject)
      throw new Error(
        'Given project either not exist or is not allowed to be view by the user',
      );

    const generatedTitle = await this.aiService.generateTitle(query);

    console.log(generatedTitle);

    const createdChat = await this.chatService.create({
      projectId,
      title: generatedTitle,
    });

    const insertedHumanMessage = await this.chatService.createMessage({
      chatId: createdChat.id,
      content: query,
      type: 'human',
    });

    const relevantDocs =
      await this.projectService.findSimiliarFromProjectFileEmbeddings(
        projectId,
        query,
      );

    console.log(relevantDocs);

    const result = await this.aiService.giveResponse(
      relevantDocs.map((c) => c.content),
      query,
    );

    const insertedAiMessage = await this.chatService.createMessage({
      chatId: createdChat.id,
      content: result,
      type: 'ai',
    });

    return res.status(StatusCodes.CREATED).send({
      projectId,
      chatId: createdChat.id.toString(),
      title: createdChat.title,
      messageIdHuman: insertedHumanMessage.id.toString(),
      query: insertedHumanMessage.content,
      messageIdAi: insertedAiMessage.id.toString(),
      aiResponse: insertedAiMessage.content,
    } as CreateNewChatResponse);
  };
}

export const chatController = new ChatController();
