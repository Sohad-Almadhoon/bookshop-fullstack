import pkg from "cloudinary";
// Imported for its side effect: guarantees .env is loaded before we read it,
// whatever order the routes happen to be imported in.
import "./env.js";

const { v2: cloudinary } = pkg;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

export const isCloudinaryConfigured = Boolean(
  process.env.CLOUD_NAME && process.env.CLOUD_API_KEY && process.env.CLOUD_API_SECRET
);

export default cloudinary;
