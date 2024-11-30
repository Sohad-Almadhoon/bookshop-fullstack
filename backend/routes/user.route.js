import express from "express";
import {
  getFollowedBooks,
  getUser,
  getUserBooks,
} from "../controllers/user.controller.js";
import verifyToken from "../middlewares/verifyToken.js";

const router = express.Router();

router.get("/:id", verifyToken, getUser);
router.get("/:userId/books", verifyToken, getUserBooks);
router.get("/:userId/followed-books", verifyToken, getFollowedBooks);


export default router;
