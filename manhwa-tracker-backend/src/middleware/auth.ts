import User from "../models/User.ts";
import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
interface AuthTokenPayload extends JwtPayload {
  id: string;
}

const auth = async (
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET not defined");
    }

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as AuthTokenPayload;

    const user = await User.findById(decoded.id);

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

export default auth;