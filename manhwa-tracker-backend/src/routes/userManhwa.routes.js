import express from "express";
import { createUserManhwa, getUserManhwa } from "../controllers/userManhwa.controller.js";
import auth from "../middleware/auth.js";
import asyncHandler from "../middleware/asyncHandler.js";

const router = express.Router();

router.post("/user-manhwa", auth, asyncHandler(createUserManhwa));
router.get("/user-manhwa", auth, asyncHandler(getUserManhwa));

export default router;