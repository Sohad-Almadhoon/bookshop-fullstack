import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import bookRoutes from "./routes/book.route.js";
import commentRoutes from "./routes/book_comment.route.js";
import chapterRoutes from "./routes/book_chapter.route.js";
import conversationRoutes from "./routes/conversation.route.js";
import messageRoutes from "./routes/message.route.js";
const app = express();
dotenv.config();
app.use(express.json());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

//Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/book", bookRoutes);
app.use("/api/comment", commentRoutes);
app.use("/api/chapter", chapterRoutes);
app.use("/api/conversations", conversationRoutes);
app.use("/api/messages", messageRoutes);

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// Middleware to handle file uploads
const upload = multer({ dest: "uploads/" });

app.post("/api/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded");
  }

  // Upload file to Cloudinary
  cloudinary.uploader.upload(
    req.file.path,
    { upload_preset: "bookshop" },
    (error, result) => {
      if (error) {
        return res.status(500).send(error);
      }

      // Remove the file from local uploads after uploading
      fs.unlink(req.file.path, (err) => {
        if (err) {
          console.error("Error deleting temp file:", err);
        } else {
          console.log(`Successfully deleted ${req.file.path}`);
        }
      });

      return res.json({ url: result.secure_url });
    }
  );
});

// Error handling middleware
app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong!";
  return res.status(errorStatus).send(errorMessage);
});

// Start the server
app.listen(5000, () => {
  console.log("Backend server is running on port 5000!");
});
