import { Types } from "mongoose";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string; // or Types.ObjectId if you prefer later
      };
    }
  }
}

export {};