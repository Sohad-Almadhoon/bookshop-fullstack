import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import multer from "multer";
import {v2 as cloudinary} from 'cloudinary';

const app = express();
dotenv.config();
app.use(express.json());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});
// Middleware to handle file uploads
const upload = multer({ dest: "uploads/" });

app.post("/api/upload", upload.single("file"), (req, res) => {
  cloudinary.uploader.upload(
    req.file.path,
    { upload_preset: "bookshop" },
    (error, result) => {
      if (error) {
        return res.status(500).send(error);
      }
      res.json({ url: result.secure_url });
    }
  );
});

app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong!";

  return res.status(errorStatus).send(errorMessage);
});

app.listen("5000", () => {
  console.log("Backend server is running!");
});