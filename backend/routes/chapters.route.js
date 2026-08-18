import express from "express";
import verifyToken from "../middlewares/verifyToken.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import validateRequest from "../middlewares/validateRequest.js";
import { requireChapterAccess, requireChapterOwner } from "../middlewares/authorize.js";
import {
  chapterContentSchema,
  updateChapterSchema,
  updateTextBlockSchema,
} from "../validations/content.validation.js";
import {
  getChapter,
  updateChapter,
  getChapterContent,
  createChapterContent,
  updateTextBlock,
  deleteTextBlock,
  deleteChapterAudio,
  deleteChapter,
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

// Editing and removing are owner-only: individual paragraphs carry no author.
router.patch(
  "/:chapterId/content/text/:index",
  requireChapterOwner,
  validateRequest(updateTextBlockSchema),
  asyncHandler(updateTextBlock)
);
router.delete(
  "/:chapterId/content/text/:index",
  requireChapterOwner,
  asyncHandler(deleteTextBlock)
);
router.delete(
  "/:chapterId/content/audio",
  requireChapterOwner,
  asyncHandler(deleteChapterAudio)
);
router.patch(
  "/:chapterId",
  requireChapterOwner,
  validateRequest(updateChapterSchema),
  asyncHandler(updateChapter)
);
router.delete("/:chapterId", requireChapterOwner, asyncHandler(deleteChapter));

export default router;
