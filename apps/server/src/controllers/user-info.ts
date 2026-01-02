import type { Request, Response } from 'express';

export const userInfo = (req: Request, res: Response) => {
  const { id } = req.params;

  res.json({
    id,
    name: 'John Doe',
    email: 'john.doe@example.com',
  });
};
