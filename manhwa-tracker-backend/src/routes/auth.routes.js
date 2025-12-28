import express from "express";
import { registerController, loginController } from "../controllers/auth.controller.js";
import asyncHandler from "../middleware/asyncHandler.js";

const router = express.Router();

router.post("/register", asyncHandler(registerController));
router.post("/login", asyncHandler(loginController));

export default router;