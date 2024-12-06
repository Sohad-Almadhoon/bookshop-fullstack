import express from "express";
import Stripe from "stripe";
import verifyToken from "../middlewares/verifyToken.js";
import prisma from "../utils/db.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-11-20.acacia",
});

const router = express.Router();

// Payment creation route
router.post("/", verifyToken, async (req, res) => {
  const { id } = req.user;
  if (!id) {
    return res.status(400).json({ error: "User ID is required." });
  }
  try {
    const user = await prisma.users.findUnique({
      where: { id },
    });
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Bookshop Subscription",
            },
            unit_amount: 500,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: req.headers.referer,
      customer_email: user.email,
    });

    res.status(200).json({ id: session.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
