import express from "express";
import verifyToken from "../middlewares/verifyToken.js";
import {
  createChapter,
  createChapterContent,
} from "../controllers/book_chapter.controller.js";

const router = express.Router();
router.post("/:bookId", verifyToken, createChapter);
router.post("/content/:chapterId", verifyToken, createChapterContent);

export default router;
