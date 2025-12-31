import express from "express";
import { registerController, loginController } from "../controllers/auth.controller.ts";
import asyncHandler from "../middleware/asyncHandler.ts";

const router = express.Router();

router.post("/register", asyncHandler(registerController));
router.post("/login", asyncHandler(loginController));

export default router;