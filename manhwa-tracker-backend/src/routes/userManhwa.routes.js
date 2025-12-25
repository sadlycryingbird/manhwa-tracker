import express from "express";
import { createUserManhwa } from "../controllers/userManhwa.controller.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/user-manhwa", auth, createUserManhwa);

export default router;