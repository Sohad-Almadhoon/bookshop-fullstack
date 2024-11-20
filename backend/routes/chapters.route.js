import express from "express";
import {
  createChapterContent,
  getChapterContent,
} from "../controllers/book_chapter.controller.js";
const router = express.Router();

//Chapters Content
router.get("/chapterId/content", verifyToken, getChapterContent);
router.post("/chapterId/content", verifyToken, createChapterContent);


export default router;
