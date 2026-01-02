import express from "express";
import { createUserManhwa, getUserManhwa, updateUserManhwa, deleteUserManhwa } from "../controllers/userManhwa.controller.ts";
import auth from "../middleware/auth.ts";
import asyncHandler from "../middleware/asyncHandler.ts";

const router = express.Router();

router.post("/", auth, asyncHandler(createUserManhwa));
router.get("/", auth, asyncHandler(getUserManhwa));
router.patch("/:id", auth, asyncHandler(updateUserManhwa));
router.delete("/:id", auth, asyncHandler(deleteUserManhwa));

export default router;