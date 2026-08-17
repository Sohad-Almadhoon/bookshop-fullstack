import express from "express";
import verifyToken from "../middlewares/verifyToken.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import { requireConversationParticipant } from "../middlewares/authorize.js";
import {
  getUserConversations,
  getConversation,
} from "../controllers/conversation.controller.js";
import { getAllMessages } from "../controllers/message.controller.js";

const router = express.Router();

router.use(verifyToken);

router.get("/", asyncHandler(getUserConversations));
router.get("/:id", requireConversationParticipant, asyncHandler(getConversation));
router.get(
  "/:id/messages",
  requireConversationParticipant,
  asyncHandler(getAllMessages)
);

export default router;
