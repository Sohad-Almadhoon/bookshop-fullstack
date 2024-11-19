import express from "express";
import verifyToken from "../middlewares/verifyToken.js";
import { getAllMessages, sendMessage } from "../controllers/message.controller.js";


const router = express.Router();
router.post("/:conversationId", verifyToken, sendMessage);
router.get("/:conversationId", verifyToken, getAllMessages);

export default router;
