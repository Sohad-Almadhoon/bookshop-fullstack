import express from "express";
import {
  getChapterContent,
  createChapterContent,
} from "../controllers/book_chapter.controller.js";
const router = express.Router();
import verifyToken from "../middlewares/verifyToken.js";

//Chapters Content
router.get("/:chapterId/content", verifyToken, getChapterContent);
router.post("/:chapterId/content", verifyToken, createChapterContent);


export default router;
