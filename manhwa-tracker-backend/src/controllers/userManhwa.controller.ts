import UserManhwa, { IUserManhwa } from "../models/UserManhwa.ts";
import { Request, Response, NextFunction } from "express";

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

    const userId = req.user!.id;

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

export const getUserManhwa = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Extract query params with defaults
    const { status, sort, page = 1, limit = 10 } = req.query;

    // Build filter
    const filter = { userId };

    if (status) {
        filter.status = status;
    }

    // Build sort option
    let sortOption = { createdAt: -1 };
    if (sort === "alphabetical") {
        sortOption = { manhwaId: 1 };
    }
    
    // Parse pagination values safely
    const pageNum = Math.max(parseInt(page, 10), 1);
    const limitNum = Math.min(parseInt(limit, 10), 50); // safety cap
    const skip = (pageNum - 1) * limitNum;

    // Execute queries
    const [total, data] = await Promise.all([
      UserManhwa.countDocuments(filter),
      UserManhwa.find(filter)
        .sort(sortOption)
        .skip(skip)
        .limit(limitNum)
    ]);

    // Return paginated response
    res.status(200).json({
        success: true,
        data,
        page: pageNum,
        limit: limitNum,
        total
    });

  } catch (error) {
    next(error);
  }
};


export const updateUserManhwa = async(req, res, next) => {
    try {
        
        const userId = req.user.id;
        const { id } = req.params;
        const { status } = req.body;

        const allowedStatuses = ["plan to read", "reading", "completed"];

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

export const deleteUserManhwa = async(req, res, next) => {

    try {

        const userId = req.user.id;
        const { id } = req.params;
        

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
