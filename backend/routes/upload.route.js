import express from 'express';
import { audioUploader, imageUploader } from '../utils/storage.js';

const router = express.Router();
router.post("/image", imageUploader.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No image file uploaded" });
  }

  // File URL returned by Cloudinary
  const imageUrl = req.file.path;

  res.json({
    url: imageUrl,
  });
});

router.post("/audio", audioUploader.single("audio"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No audio file uploaded" });
  }

  // File URL returned by Cloudinary
  const audioUrl = req.file.path;

  res.json({
    url: audioUrl,
  });
});

export default router;