import express from "express";
import { register, login } from "../controllers/auth.controller.js";
import validateRequest from "../middlewares/validateRequest.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import { registerSchema, loginSchema } from "../validations/auth.validation.js";

const router = express.Router();

router.post("/register", validateRequest(registerSchema), asyncHandler(register));
router.post("/login", validateRequest(loginSchema), asyncHandler(login));

export default router;
