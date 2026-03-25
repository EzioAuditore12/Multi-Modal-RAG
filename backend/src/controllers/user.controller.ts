import type { Request, RequestHandler, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { userService } from '@/services/user.service';
import { NotFoundError } from 'express-error-toolkit';
import { publicUserSchema } from '@/db/models/user.model';

class UserController {
  private readonly userSerice = userService;

  public getUser: RequestHandler = async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const serviceResponse = await userService.findById(id);
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };

  public getProfile: RequestHandler = async (req: Request, res: Response) => {
    const userId = req.user?.id as string;

    const userDetails = await this.userSerice.findOne(userId);

    if (!userDetails)
      throw new NotFoundError('Given user with this id not found');

    const result = publicUserSchema.strip().parse(userDetails);

    return res.status(StatusCodes.OK).send(result);
  };
}

export const userController = new UserController();
