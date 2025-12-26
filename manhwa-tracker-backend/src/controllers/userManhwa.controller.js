import UserManhwa from "../models/UserManhwa.js";
import asyncHandler from "../middleware/asyncHandler.js";

export const createUserManhwa = asyncHandler(async (req, res, next) => {

    const userId = req.user.id;

    const { manhwaId, status, currentChapter } = req.body;

    const userManhwa = await UserManhwa.create({
      userId,          
      manhwaId,
      status,
      currentChapter,
    });

    res.status(201).json(userManhwa);

});
