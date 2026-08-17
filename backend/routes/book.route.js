import express from "express";
import verifyToken from "../middlewares/verifyToken.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import validateRequest from "../middlewares/validateRequest.js";
import { requireBookAccess } from "../middlewares/authorize.js";
import {
  createBookSchema,
  createChapterSchema,
  createCommentSchema,
} from "../validations/content.validation.js";
import {
  createBook,
  followBook,
  getBook,
  getBookStates,
  getRandomBooks,
  likeBook,
  unLikeBook,
  unFollowBook,
  getBookStats,
} from "../controllers/book.controller.js";
import {
  createComment,
  deleteComment,
  getComments,
} from "../controllers/book_comment.controller.js";
import {
  createChapter,
  getBookChapter,
  getBookChapters,
} from "../controllers/book_chapter.controller.js";

const router = express.Router();

// Every book route requires a valid session.
router.use(verifyToken);

router.post("/", validateRequest(createBookSchema), asyncHandler(createBook));
router.get("/random-books", asyncHandler(getRandomBooks));
router.get("/:id", asyncHandler(getBook));

// Comments
router.post("/:id/comments", validateRequest(createCommentSchema), asyncHandler(createComment));
router.get("/:id/comments", asyncHandler(getComments));
router.delete("/:id/comments/:commentId", asyncHandler(deleteComment));

// Chapters - creating one requires ownership or an active subscription.
router.get("/:id/chapters", asyncHandler(getBookChapters));
router.get("/:id/chapters/:chapterId", requireBookAccess, asyncHandler(getBookChapter));
router.post(
  "/:id/chapters",
  requireBookAccess,
  validateRequest(createChapterSchema),
  asyncHandler(createChapter)
);

// Follow / like
router.post("/:id/follow", asyncHandler(followBook));
router.delete("/:id/follow", asyncHandler(unFollowBook));
router.post("/:id/like", asyncHandler(likeBook));
router.delete("/:id/like", asyncHandler(unLikeBook));

router.get("/:id/book-states", asyncHandler(getBookStates));
router.get("/:id/stats", asyncHandler(getBookStats));

export default router;
