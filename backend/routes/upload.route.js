import express from "express";
import verifyToken from "../middlewares/verifyToken.js";
import { uploadLimiter } from "../middlewares/rateLimit.js";
import { audioUploader, imageUploader } from "../utils/storage.js";
import { isCloudinaryConfigured } from "../utils/cloudinary.js";

const router = express.Router();

// Uploads were completely open before: no session, no rate limit, no size cap.
router.use(verifyToken, uploadLimiter);

router.use((req, res, next) => {
  if (!isCloudinaryConfigured) {
    return res.status(503).json({ error: "File uploads are not configured on this server." });
  }
  next();
});

router.post("/image", imageUploader.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No image file uploaded" });
  }
  res.json({ url: req.file.path });
});

router.post("/audio", audioUploader.single("audio"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No audio file uploaded" });
  }
  res.json({ url: req.file.path });
});

export default router;
