import express from "express";
import {
  getUser,
  getUserBooks,
} from "../controllers/user.controller.js";
import verifyToken from "../middlewares/verifyToken.js";

const router = express.Router();

router.get("/:id", verifyToken, getUser);
router.get("/:userId/books", verifyToken, getUserBooks);

export default router;
