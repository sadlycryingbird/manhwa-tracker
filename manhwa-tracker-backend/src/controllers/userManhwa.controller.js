import UserManhwa from "../models/UserManhwa.js";

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
