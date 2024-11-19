import express from "express";
import verifyToken from "../middlewares/verifyToken.js";
import {
  getUserConversations,
  createConversation,
  getConversationParticipants,
} from "../controllers/conversation.controller.js";

const router = express.Router();
// Create a new conversation
router.post("/", verifyToken, createConversation);
router.get("/", verifyToken, getUserConversations);
router.get("/participants/:conversationId", verifyToken, getConversationParticipants);

export default router;
