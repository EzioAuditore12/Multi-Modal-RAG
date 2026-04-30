import fs from 'node:fs';

import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { createSession } from 'better-sse';

import { CreateNewChatRequest } from '@/schemas/chat/new/request';
import { aiService } from '@/services/ai.service';
import { chatService } from '@/services/chat.service';
import { projectService } from '@/services/project.service';
import { GetProjectChatsRequest } from '@/schemas/chat/get-project-chats';
import { messageService } from '@/services/message.service';
import { NotFoundError } from 'express-error-toolkit';

export class ChatController {
  private readonly aiService = aiService;
  private readonly projectService = projectService;
  private readonly chatService = chatService;
  private readonly messageService = messageService;

  public getChatsofProject = async (
    req: GetProjectChatsRequest,
    res: Response,
  ) => {
    const userId = req.user?.id!;
    const { pageSize, cursor, search, projectId } = req.query;

    const isAuthenticedUserAndExisitingProject =
      await this.projectService.findByIdAndIsAuthenticatedUser(
        projectId,
        userId,
      );

    if (!isAuthenticedUserAndExisitingProject)
      throw new Error(
        'Given project either not exist or is not allowed to be view by the user',
      );

    const response = await this.chatService.getAll({
      pageSize,
      projectId,
      cursor,
      search,
    });

    return res.status(StatusCodes.OK).send(
      response.map((c) => ({
        ...c,
        id: c.id.toString(),
      })),
    );
  };

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
      'Authenticating session and validating workspace...',
      MESSAGE_EVENT_NAME,
    );

    try {
      if (isFirstTime) {
        const generatedTitle = await this.aiService.generateTitle(query);

        const createdChat = await this.chatService.create({
          id: chatId,
          projectId,
          title: generatedTitle,
        });

        // We can optionally push this to message steps too
        session.push('Generated conversation title.', MESSAGE_EVENT_NAME);

        session.push(
          { chatId: createdChat.id.toString(), title: createdChat.title },
          PROJECT_TITLE_WITH_CHAT_ID_EVENT_NAME,
        );
      }

      await this.messageService.create({
        id: messageId,
        chatId,
        content: query,
        type: 'human',
      });

      session.push(
        'Saved user query to conversation history.',
        MESSAGE_EVENT_NAME,
      );

      const relevantDocs =
        await this.projectService.findSimiliarFromProjectFileEmbeddings(
          projectId,
          query,
        );

      // Give a little info limit on the docs
      const docPreviewInfo = relevantDocs.length
        ? ` (Sources extracted: ${relevantDocs.length * 10}0 bytes analyzed)`
        : '';

      session.push(
        `Retrieved ${relevantDocs.length} relevant documents from the knowledge base${docPreviewInfo}.`,
        MESSAGE_EVENT_NAME,
      );

      session.push('Synthesizing final response...', MESSAGE_EVENT_NAME);

      let fullResponse = '';
      const stream = this.aiService.streamResponse(
        relevantDocs.map((c) => c.content),
        query,
      );

      for await (const chunk of stream) {
        fullResponse += chunk;
        session.push({ text: chunk }, 'message_chunk');
      }

      const insertedAiMessage = await this.messageService.create({
        chatId,
        content: fullResponse,
        type: 'ai',
      });

      session.push(
        {
          id: insertedAiMessage.id.toString(),
          content: insertedAiMessage.content,
        },
        FINAL_RESULT_EVENT,
      );
    } catch (error: any) {
      console.error('Error in chat processing:', error);
      session.push(
        `Error: ${error?.message || 'Internal Server Error'}`,
        MESSAGE_EVENT_NAME,
      );
    } finally {
      // Disconnect/End the SSE request cleanly so it doesn't hang!
      res.end();
    }
  };

  public delete = async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const userId = req.user?.id!;

    const isExistingChat = await this.chatService.findById(BigInt(id));

    if (!isExistingChat)
      throw new NotFoundError(`Unable to find the chat with ${id}`);

    await this.chatService.delete(BigInt(id));

    return res
      .status(StatusCodes.ACCEPTED)
      .send({ result: `Deleted chat with ${id}` });
  };
}

export const chatController = new ChatController();
