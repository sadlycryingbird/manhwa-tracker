import UserManhwa from "../models/UserManhwa.js";
import { findManhwaOrFail } from "../helpers/userManhwa.helpers.js";

export const createUserManhwa = async (req, res, next) => {

    try {
    const userId = req.user.id;

    const { manhwaId, status, currentChapter } = req.body;

    const userManhwa = await UserManhwa.create({
      userId,          
      manhwaId,
      status,
      currentChapter,
    });

    res.status(201).json(userManhwa);
    } catch (error) {
        next(error);
    }

};

export const getUserManhwa = async (req, res, next) => {
    try {

        const userId = req.user.id;

        const displayedManhwa = await UserManhwa.find({userId});

        res.status(200).json(displayedManhwa);

    } catch (error) {
        next(error);
    }
}

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
        
        return res.status(200).json(manhwa);
    
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

        return res.status(200).json({ success: true, message: "Manhwa deleted"});

    } catch (error) {

        next(error);

    }

}
