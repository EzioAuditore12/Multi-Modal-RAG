import type { Request, Response } from "express";

export const indexController = (req: Request, res: Response) => {
  res.status(200).send("Hello");
};
