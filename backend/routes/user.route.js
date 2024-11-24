import express from "express";
import {
  followUser,
  getFollowingUserBooks,
  getUser,
  getUserBooks,
} from "../controllers/user.controller.js";
import verifyToken from "../middlewares/verifyToken.js";

const router = express.Router();

router.get("/:id", verifyToken, getUser);
router.post("/follow", verifyToken, followUser);
router.get("/following/books", verifyToken, getFollowingUserBooks);
router.get("/:userId/books", verifyToken, getUserBooks);

export default router;
