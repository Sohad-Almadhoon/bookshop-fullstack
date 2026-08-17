import express from "express";
import verifyToken from "../middlewares/verifyToken.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import validateRequest from "../middlewares/validateRequest.js";
import { requireConversationParticipant } from "../middlewares/authorize.js";
import { sendMessageSchema } from "../validations/content.validation.js";
import { getAllMessages, sendMessage } from "../controllers/message.controller.js";

const router = express.Router();

router.use(verifyToken);

router.post(
  "/:conversationId",
  requireConversationParticipant,
  validateRequest(sendMessageSchema),
  asyncHandler(sendMessage)
);
router.get(
  "/:conversationId",
  requireConversationParticipant,
  asyncHandler(getAllMessages)
);

export default router;
