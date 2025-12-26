import jwt from "jsonwebtoken";// your User model
import dotenv from "dotenv";
dotenv.config();

const auth = async (req, res, next) => {
  try {

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = { id: decoded.id }; 
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

export default auth;