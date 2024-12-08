import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import bookRoutes from "./routes/book.route.js";
import chapterRoutes from "./routes/chapters.route.js";
import conversationRoutes from "./routes/conversation.route.js";
import messageRoutes from "./routes/message.route.js";
import uploadRoutes from "./routes/upload.route.js";
import checkoutRouter from './routes/checkout.route.js'; 
import paymentRouter from './routes/payment.route.js'; 
import { errorHandler } from "./middlewares/errorMiddleware.js";
import bodyParser from "body-parser";
const app = express();
dotenv.config();
app.use(express.json());
// app.use(
//   cors({
//     origin: "http://localhost:3000", 
//     credentials: true, 
//   })
// );
app.use(
  cors({
    origin: "https://bookshop-frontend-gold.vercel.app",
    credentials: true, 
  })
);

app.use(bodyParser.json());

const routes = {
  "/api/warmup": (req, res) => {
    res.send("Server is running")
  },
  "/api/auth": authRoutes,
  "/api/users": userRoutes,
  "/api/books": bookRoutes,
  "/api/chapters": chapterRoutes,
  "/api/conversations": conversationRoutes,
  "/api/messages": messageRoutes,
  "/api/upload": uploadRoutes,
  "/api/create-checkout-session": checkoutRouter,
  "/api/payment": paymentRouter,
};
Object.keys(routes).forEach((route) => app.use(route, routes[route]));


// Use the error handling middleware
app.use(errorHandler);

// Start the server
app.listen(5000, () => {
  console.log("Backend server is running on port 5000!");
});
