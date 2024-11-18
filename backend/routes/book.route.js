import express from "express";
import verifyToken from "../middlewares/verifyToken.js";
import { createBook } from "../controllers/book.controller.js";

const router = express.Router();
router.post("/", verifyToken, createBook);

export default router;
