import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import cloudinary from './cloudinary.js';
// Cloudinary storage for images
const imageStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "images",
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});

// Cloudinary storage for audio files
const audioStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "audio",
    resource_type: "raw",
    allowed_formats: ["mp3", "wav"],
  },
});

const imageUploader = multer({ storage: imageStorage });
const audioUploader = multer({ storage: audioStorage });

export { imageUploader, audioUploader };
