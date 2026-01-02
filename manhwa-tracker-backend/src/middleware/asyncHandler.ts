import { Request, Response, NextFunction, RequestHandler } from "express";

// Wrap an async route handler and catch errors
const asyncHandler = (fn: RequestHandler): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export default asyncHandler;