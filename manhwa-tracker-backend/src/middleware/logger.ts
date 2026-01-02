import { Request, Response, NextFunction } from "express";

const logger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(
      `Timestamp: ${new Date().toISOString()} | Request Type: ${req.method} | Request URL: ${req.url} | Status Code: ${res.statusCode} | Time Took: ${duration}ms`
    );
  });

  next();
};

export default logger;