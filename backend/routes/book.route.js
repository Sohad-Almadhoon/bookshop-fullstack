import express from "express";
import verifyToken from "../middlewares/verifyToken.js";
import {
  createBook,
  followBook,
  getBook,
  getBookStates,
  getRandomBooks,
  likeBook,
  unLikeBook,
  unFollowBook,
} from "../controllers/book.controller.js";
import {
  createComment,
  getComments,
} from "../controllers/book_comment.controller.js";
import {
  createChapter,
  getBookChapter,
  getBookChapters,
} from "../controllers/book_chapter.controller.js";

const router = express.Router();

router.post("/", verifyToken, createBook);
router.get("/random-books", verifyToken, getRandomBooks);
router.get("/:id", verifyToken, getBook);

//Comments
router.post("/:id/comments", verifyToken, createComment);
router.get("/:id/comments", verifyToken, getComments);

//Chapters
router.get("/:id/chapters", verifyToken, getBookChapters);
router.get("/:id/chapters/:chapterId", verifyToken, getBookChapter);

router.post("/:id/chapters", verifyToken, createChapter);

router.post("/:id/follow", verifyToken, followBook);

router.delete("/:id/follow", verifyToken, unFollowBook);

router.post("/:id/like", verifyToken, likeBook);
router.delete("/:id/like", verifyToken, unLikeBook);
router.get("/:id/book-states", verifyToken, getBookStates);

export default router;

