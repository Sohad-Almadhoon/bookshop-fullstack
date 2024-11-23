import express from "express";
import {
  connectUserWithBook,
  followUser,
  getUser,
  getUserBooks,
} from "../controllers/user.controller.js";
import verifyToken from "../middlewares/verifyToken.js";

const router = express.Router();

router.get("/:id", verifyToken, getUser);
router.post("/follow", verifyToken, followUser);
router.post("/:userId/books", verifyToken, connectUserWithBook);
router.get("/:userId/books", verifyToken, getUserBooks);

export default router;
