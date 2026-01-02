import type { Request, Response, NextFunction } from 'express';

// Only type params and body for requests
export type AppRequest<
  Params = Record<string, never>,
  ReqBody = unknown,
> = Request<Params, unknown, ReqBody>;

// Response type for outgoing data
export type AppResponse<Data = unknown> = Response<Data>;

// Error response shape
export type ErrorResponse = { message: string };

// Generic route handler
export type AppRouteHandler<Req = Request, Res = Response, Return = unknown> = (
  req: Req,
  res: Res,
  next?: NextFunction,
) => Return;
