import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import cloudinary from "./cloudinary.js";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5 MB
const MAX_AUDIO_BYTES = 20 * 1024 * 1024; // 20 MB

const imageStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "images",
    allowed_formats: ["jpg", "png", "jpeg", "webp", "gif"],
  },
});

const audioStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "audio",
    resource_type: "raw",
    allowed_formats: ["mp3", "wav"],
  },
});

// Reject by mime type before anything is streamed to Cloudinary.
const fileFilter = (prefix) => (req, file, cb) => {
  if (file.mimetype?.startsWith(prefix)) return cb(null, true);
  cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE", file.fieldname));
};

const imageUploader = multer({
  storage: imageStorage,
  limits: { fileSize: MAX_IMAGE_BYTES, files: 1 },
  fileFilter: fileFilter("image/"),
});

const audioUploader = multer({
  storage: audioStorage,
  limits: { fileSize: MAX_AUDIO_BYTES, files: 1 },
  fileFilter: fileFilter("audio/"),
});

export { imageUploader, audioUploader, MAX_IMAGE_BYTES, MAX_AUDIO_BYTES };
