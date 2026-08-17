// MUST be first: loads and validates .env before any module reads process.env.
import env from "./utils/env.js";

import express from "express";
import cors from "cors";
import helmet from "helmet";

import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import bookRoutes from "./routes/book.route.js";
import chapterRoutes from "./routes/chapters.route.js";
import conversationRoutes from "./routes/conversation.route.js";
import messageRoutes from "./routes/message.route.js";
import uploadRoutes from "./routes/upload.route.js";
import checkoutRouter from "./routes/checkout.route.js";
import paymentRouter from "./routes/payment.route.js";
import { errorHandler, notFoundHandler } from "./middlewares/errorMiddleware.js";
import { apiLimiter, authLimiter } from "./middlewares/rateLimit.js";

const app = express();

app.set("trust proxy", 1); // correct client IPs behind Render/Vercel proxies
app.use(helmet());

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow same-origin/server-to-server calls (no Origin header).
      if (!origin || env.clientUrls.includes(origin)) return callback(null, true);
      return callback(new Error(`Origin ${origin} is not allowed by CORS`));
    },
    credentials: true,
  })
);

// Stripe signatures are computed over the raw body, so this must be mounted
// before express.json().
app.use("/api/payment/webhook", express.raw({ type: "application/json" }));

app.use(express.json({ limit: "1mb" }));
app.use(apiLimiter);

app.get("/api/warmup", (req, res) => res.json({ status: "ok" }));

app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/chapters", chapterRoutes);
app.use("/api/conversations", conversationRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/create-checkout-session", checkoutRouter);
app.use("/api/payment", paymentRouter);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(env.port, () => {
  console.log(`Backend server is running on port ${env.port}!`);
});

export default app;
