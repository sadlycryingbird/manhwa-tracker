const validateManhwa = (req, res, next) => {
    const {title, status} = req.body;

    if (!title || !status) {
        return res.status(400).json({
            success: false,
            message: "Title and status are required"
        });
    }
    next();
};

export default validateManhwa;