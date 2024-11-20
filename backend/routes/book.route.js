import express from "express";
import verifyToken from "../middlewares/verifyToken.js";
import { createBook, getBook } from "../controllers/book.controller.js";
import {
  createComment,
  getComments,
} from "../controllers/book_comment.controller.js";
import {
  createChapter,
  createChapterContent,
  getBookChapters,
  getChapterContent,
} from "../controllers/book_chapter.controller.js";

const router = express.Router();

router.post("/", verifyToken, createBook);
router.get("/:id", verifyToken, getBook);

//Comments
router.post("/:id/comments", verifyToken, createComment);
router.get("/:id/comments", verifyToken, getComments);

//Chapters
router.get("/:id/chapters", verifyToken, getBookChapters);
router.post("/:id/chapters", verifyToken, createChapter);
// User-Books
router.get("/:id/users", verifyToken, createBook);


export default router;
