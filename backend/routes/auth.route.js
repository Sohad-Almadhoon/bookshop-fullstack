import express from "express";
import {
  register,
  login,
} from "../controllers/auth.controller.js";
import validateRequest from "../middlewares/validateRequest.js";
import { registerSchema, loginSchema } from "../validations/auth.validation.js";

const router = express.Router();

// Routes with validation
router.post("/register", validateRequest(registerSchema), register);
router.post("/login", validateRequest(loginSchema), login);

export default router;
