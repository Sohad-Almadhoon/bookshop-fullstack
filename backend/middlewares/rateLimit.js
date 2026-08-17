import rateLimit from "express-rate-limit";

const common = {
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests. Please try again later." },
};

// Brute-force protection for credentials.
export const authLimiter = rateLimit({
  ...common,
  windowMs: 15 * 60 * 1000,
  limit: 20,
  skipSuccessfulRequests: true,
});

// Cloudinary costs money per upload: keep it tight.
export const uploadLimiter = rateLimit({
  ...common,
  windowMs: 60 * 60 * 1000,
  limit: 30,
});

// Broad safety net for the rest of the API.
export const apiLimiter = rateLimit({
  ...common,
  windowMs: 60 * 1000,
  limit: 300,
});

export default apiLimiter;
