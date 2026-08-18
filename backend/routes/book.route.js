import express from "express";
import verifyToken from "../middlewares/verifyToken.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import validateRequest from "../middlewares/validateRequest.js";
import { requireBookAccess, requireBookOwner } from "../middlewares/authorize.js";
import {
  createBookSchema,
  updateBookSchema,
  createChapterSchema,
  reorderChaptersSchema,
  createCommentSchema,
} from "../validations/content.validation.js";
import {
  createBook,
  updateBook,
  searchBooks,
  getGenres,
  deleteBook,
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
  reorderChapters,
} from "../controllers/book_chapter.controller.js";

const router = express.Router();

// Every book route requires a valid session.
router.use(verifyToken);

router.post("/", validateRequest(createBookSchema), asyncHandler(createBook));
router.get("/random-books", asyncHandler(getRandomBooks));
// the library: search, filter, sort, paginate
router.get("/search", asyncHandler(searchBooks));
router.get("/genres", asyncHandler(getGenres));
router.get("/:id", asyncHandler(getBook));
router.patch(
  "/:id",
  requireBookOwner,
  validateRequest(updateBookSchema),
  asyncHandler(updateBook)
);
router.delete("/:id", requireBookOwner, asyncHandler(deleteBook));

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

router.patch(
  "/:id/chapters/order",
  requireBookOwner,
  validateRequest(reorderChaptersSchema),
  asyncHandler(reorderChapters)
);

// Follow / like
router.post("/:id/follow", asyncHandler(followBook));
router.delete("/:id/follow", asyncHandler(unFollowBook));
router.post("/:id/like", asyncHandler(likeBook));
router.delete("/:id/like", asyncHandler(unLikeBook));

router.get("/:id/book-states", asyncHandler(getBookStates));
router.get("/:id/stats", asyncHandler(getBookStats));

export default router;
