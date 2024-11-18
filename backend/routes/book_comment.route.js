import express from "express";
import verifyToken from "../middlewares/verifyToken.js";
import { createComment } from "../controllers/book_comment.controller.js";

const router = express.Router();
router.post("/", verifyToken, createComment);

export default router;
