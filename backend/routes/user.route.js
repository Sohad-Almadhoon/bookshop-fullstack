import express from "express";
import verifyToken from "../middlewares/verifyToken.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import {
  getFollowedBooks,
  getMe,
  getUser,
  getUserBooks,
} from "../controllers/user.controller.js";

const router = express.Router();

router.use(verifyToken);

// Must stay above "/:id" so "me" is not parsed as an id.
router.get("/me", asyncHandler(getMe));
router.get("/:id", asyncHandler(getUser));
router.get("/:userId/books", asyncHandler(getUserBooks));
router.get("/:userId/followed-books", asyncHandler(getFollowedBooks));

export default router;
