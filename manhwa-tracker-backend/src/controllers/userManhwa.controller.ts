import UserManhwa, { IUserManhwa } from "../models/UserManhwa.ts";
import { Request, Response, NextFunction } from "express";
import { FilterQuery } from "mongoose";

export const createUserManhwa = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {

    try {

    interface CreateUserManhwaBody {
        manhwaId: string;
        status: "unread" | "reading" | "completed" | "plan_to_read";
        currentChapter: number;
    }

    const userId = req.user!._id.toString();

    const { manhwaId, status, currentChapter } = 
        req.body as CreateUserManhwaBody;

    const existingManhwa = await UserManhwa.findOne({
        userId,
        manhwaId
    });

    if (existingManhwa) {
        return res.status(409).json({
            success:false,
            message: "Manhwa already in your list"
        });
    }

    const userManhwa = await UserManhwa.create({
      userId,          
      manhwaId,
      status,
      currentChapter,
    }) as IUserManhwa;

    res.status(201).json({
        success: true,
        data: userManhwa,
        message: "Manhwa added to your list"
    });
    } catch (error) {
        next(error);
    }

};

export const getUserManhwa = async (
  req: Request<{}, {}, {}, GetUserManhwaQuery>, // req.query is typed here
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const userId = req.user._id.toString();

    const { status, sort, page = "1", limit = "10" } = req.query;

    const filter: FilterQuery<IUserManhwa> = { userId };

    if (status) {
      filter.status = status;
    }

    const sortOption: Record<string, 1 | -1> =
      sort === "alphabetical" ? { manhwaId: 1 } : { createdAt: -1 };

    const pageNum = Math.max(parseInt(page, 10), 1);
    const limitNum = Math.min(parseInt(limit, 10), 50);
    const skip = (pageNum - 1) * limitNum;

    const [total, data] = await Promise.all([
      UserManhwa.countDocuments(filter),
      UserManhwa.find(filter).sort(sortOption).skip(skip).limit(limitNum),
    ]);

    res.status(200).json({
      success: true,
      data,
      page: pageNum,
      limit: limitNum,
      total,
    });
  } catch (error) {
    next(error);
  }
};

export const updateUserManhwa = async (
    req: Request,
    res: Response, 
    next: NextFunction
) => {
    try {
        
        type UpdateUserManhwaBody = {
            status: "reading" | "completed" | "plan to read";
        }

        if (!req.user) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const userId = req.user._id.toString();
        const { id } = req.params;
        const { status } = req.body as UpdateUserManhwaBody;

         const allowedStatuses: UpdateUserManhwaBody["status"][] = [
            "reading",
            "completed",
            "plan to read",
        ];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({ success: false, message: "Invalid status" });
        }
    
        const manhwa = await UserManhwa.findById(id);

        if (!manhwa) {
            return res.status(404).json({success: false, message: "Manhwa not found"});
        }

        if (manhwa.userId.toString() !== userId) {
            return res.status(403).json({ success: false, message: "Forbidden" });
        }

        manhwa.status = status;
        await manhwa.save();
        
        return res.status(200).json({
            success: true,
            data: manhwa,
            message: "Manhwa updated"
        });
    
    } catch (error) {
        next(error);
    }
}

export const deleteUserManhwa = async(
    req: Request, 
    res: Response, 
    next: NextFunction
) => {

    try {

        if (!req.user) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const userId = req.user._id.toString();

        type Id = {
            id: string;
        }

        const { id } = req.params as Id;

        const manhwa = await UserManhwa.findById(id);

        if (!manhwa) {
            return res.status(404).json({success: false, message: "Manhwa not found"});
        }

        if (manhwa.userId.toString() !== userId) {
            return res.status(403).json({ success: false, message: "Forbidden" });
        }

        await manhwa.deleteOne();

        return res.status(200).json({ 
            success: true, 
            message: "Manhwa deleted"
        });

    } catch (error) {

        next(error);

    }
}
