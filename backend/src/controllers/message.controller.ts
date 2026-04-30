import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { GetChatMessagesRequest } from '@/schemas/messages/get-messages/request.schema';
import { messageService } from '@/services/message.service';

export class MessageController {
  private readonly messageService = messageService;

  public getAll = async (req: GetChatMessagesRequest, res: Response) => {
    const { chatId, pageSize, cursor } = req.query;

    const result = await this.messageService.getAll({
      chatId,
      pageSize,
      cursor,
    });

    return res.status(StatusCodes.OK).send(
      result.map((c) => ({
        ...c,
        id: c.id.toString(),
        chatId: c.chatId.toString(),
      })),
    );
  };
}

export const messageController = new MessageController();
