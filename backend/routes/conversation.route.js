import express from "express";
import verifyToken from "../middlewares/verifyToken.js";
import {
  getUserConversations,
  createConversation,
} from "../controllers/conversation.controller.js";
import { getAllMessages } from "../controllers/message.controller.js";

const router = express.Router();
// Create a new conversation
router.post("/", verifyToken, createConversation);
router.get("/", verifyToken, getUserConversations);
router.get("/conversations/:id/messages", verifyToken, getAllMessages);

export default router;
