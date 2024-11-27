import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// Middleware to handle file uploads using multer
const upload = multer({ dest: "uploads/" });

// POST route to upload a file
const uploadFile = (req, res) => {
  console.log(req.file); // Check the uploaded file
  console.log(req.body); // Check additional form data
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
};

export { upload, uploadFile };
