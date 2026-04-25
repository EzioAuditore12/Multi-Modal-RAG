import { Response } from 'express';

import { CreateNewChatRequest } from '@/schemas/chat/new/request';
import { aiService } from '@/services/ai.service';
import { chatService } from '@/services/chat.service';
import { projectService } from '@/services/project.service';
import { createSession } from 'better-sse';

export class ChatController {
  private readonly aiService = aiService;
  private readonly chatService = chatService;
  private readonly projectService = projectService;

  public createNewChat = async (req: CreateNewChatRequest, res: Response) => {
    const userId = req.user?.id!;
    const { chatId, projectId, query, messageId, isFirstTime } = req.query;

    const session = await createSession(req, res);

    const MESSAGE_EVENT_NAME = 'message';
    const PROJECT_TITLE_WITH_CHAT_ID_EVENT_NAME = 'project_title_with_chat_id';
    const FINAL_RESULT_EVENT = 'result';

    const isAuthenticedUserAndExisitingProject =
      await this.projectService.findByIdAndIsAuthenticatedUser(
        projectId,
        userId,
      );

    if (!isAuthenticedUserAndExisitingProject)
      throw new Error(
        'Given project either not exist or is not allowed to be view by the user',
      );

    session.push(
      'Authentication and project existion successfully, Process Started',
      MESSAGE_EVENT_NAME,
    );

    if (isFirstTime) {
      const generatedTitle = await this.aiService.generateTitle(query);

      const createdChat = await this.chatService.create({
        id: chatId,
        projectId,
        title: generatedTitle,
      });

      session.push(
        { chatId: createdChat.id.toString(), title: createdChat.title },
        PROJECT_TITLE_WITH_CHAT_ID_EVENT_NAME,
      );
    }

    await this.chatService.createMessage({
      id: messageId,
      chatId,
      content: query,
      type: 'human',
    });

    session.push('Pushing the query into human message', MESSAGE_EVENT_NAME);

    const relevantDocs =
      await this.projectService.findSimiliarFromProjectFileEmbeddings(
        projectId,
        query,
      );

    session.push(
      `Found 5 relevant docs ${JSON.stringify(relevantDocs.map((c) => c.content))}`,
      MESSAGE_EVENT_NAME,
    );

    const result = await this.aiService.giveResponse(
      relevantDocs.map((c) => c.content),
      query,
    );

    const insertedAiMessage = await this.chatService.createMessage({
      chatId,
      content: result,
      type: 'ai',
    });

    session.push(
      {
        id: insertedAiMessage.id.toString(),
        content: insertedAiMessage.content,
      },
      FINAL_RESULT_EVENT,
    );
  };
}

export const chatController = new ChatController();
