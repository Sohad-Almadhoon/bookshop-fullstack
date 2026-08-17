import express from "express";
import verifyToken from "../middlewares/verifyToken.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import validateRequest from "../middlewares/validateRequest.js";
import { requireChapterAccess } from "../middlewares/authorize.js";
import { chapterContentSchema } from "../validations/content.validation.js";
import {
  getChapter,
  getChapterContent,
  createChapterContent,
} from "../controllers/book_chapter.controller.js";

const router = express.Router();

router.use(verifyToken);

router.get("/:chapterId", requireChapterAccess, asyncHandler(getChapter));
router.get("/:chapterId/content", requireChapterAccess, asyncHandler(getChapterContent));

// Writing content is the paid feature - enforced here, not in the browser.
router.post(
  "/:chapterId/content",
  requireChapterAccess,
  validateRequest(chapterContentSchema),
  asyncHandler(createChapterContent)
);

export default router;
