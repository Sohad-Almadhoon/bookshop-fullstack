import { Prisma } from "@prisma/client";
import multer from "multer";
import env from "../utils/env.js";

// eslint-disable-next-line no-unused-vars -- Express detects the handler by arity
const errorHandler = (err, req, res, next) => {
  let status = err.status || 500;
  let message = err.message || "Something went wrong!";

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      status = 409;
      message = "This record already exists.";
    } else if (err.code === "P2025") {
      status = 404;
      message = "Record not found.";
    } else if (err.code === "P2003") {
      status = 400;
      message = "Related record does not exist.";
    }
  } else if (err instanceof Prisma.PrismaClientValidationError) {
    status = 400;
    message = "Invalid request data.";
  } else if (err instanceof multer.MulterError) {
    status = 400;
    message =
      err.code === "LIMIT_FILE_SIZE"
        ? "File is too large."
        : err.code === "LIMIT_UNEXPECTED_FILE"
        ? "Unsupported file type."
        : "File upload failed.";
  } else if (/not allowed by CORS/i.test(message)) {
    status = 403;
  }

  if (status >= 500) {
    console.error(err);
    if (env.isProduction) message = "Internal server error.";
  }

  res.status(status).json({ error: message });
};

const notFoundHandler = (req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.originalUrl} not found.` });
};

export { errorHandler, notFoundHandler };
