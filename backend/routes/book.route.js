import express from "express";
import verifyToken from "../middlewares/verifyToken.js";
import {
  createBook,
  followBook,
  getBook,
  getBookStates,
  likeBook,
  unFollowBook,
} from "../controllers/book.controller.js";
import {
  createComment,
  getComments,
} from "../controllers/book_comment.controller.js";
import {
  createChapter,
  getBookChapters,
} from "../controllers/book_chapter.controller.js";
import { getBookUsers } from "../controllers/user.controller.js";

const router = express.Router();

router.post("/", verifyToken, createBook);
router.get("/:id", verifyToken, getBook);

//Comments
router.post("/:id/comments", verifyToken, createComment);
router.get("/:id/comments", verifyToken, getComments);

//Chapters
router.get("/:id/chapters", verifyToken, getBookChapters);
router.post("/:id/chapters", verifyToken, createChapter);

router.get("/:id/users", verifyToken, getBookUsers);
router.post("/:id/follow", verifyToken, followBook);

router.delete("/:id/follow", verifyToken, unFollowBook);
router.post("/:id/like", verifyToken, likeBook);
router.delete("/:id/like", verifyToken, unFollowBook);
router.get("/:id/book-states", verifyToken, getBookStates);


export default router;

