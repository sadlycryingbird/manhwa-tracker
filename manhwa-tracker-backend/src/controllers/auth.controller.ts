import { Request, Response, NextFunction } from "express";
import User, { IUser } from "../models/User.ts";
import jwt from "jsonwebtoken";

// --- Types for request bodies ---
interface RegistrationRequestBody {
  email: string;
  password: string;
}

interface LoginRequestBody {
  email: string;
  password: string;
}

// --- Register Controller ---
export const registerController = async (
  req: Request<{}, {}, RegistrationRequestBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    const user = await User.create({ email, password });

    const token = jwt.sign(
      { id: user._id.toString() },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );

    res.status(201).json({ token });
  } catch (err) {
    next(err);
  }
};

// --- Login Controller ---
export const loginController = async (
  req: Request<{}, {}, LoginRequestBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }) as IUser | null;
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id.toString() },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );

    res.status(200).json({ token });
  } catch (err) {
    next(err);
  }
};