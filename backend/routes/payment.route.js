import express from "express";
import prisma from "../utils/db.js";
const router = express.Router();
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-11-20.acacia",
});

router.get("/success", async (req, res) => {
  const { session_id } = req.query;

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);
    if (session.payment_status === "paid") {
      const user = await prisma.users.findUnique({
        where: { email: session.customer_email },
      });

      if (user) {
        await prisma.users.update({
          where: { id: user.id },
          data: { has_paid: true},
        });
      } else {
        console.log("User not found");
      }

      res.status(200).json({
         has_paid:true,
        amountTotal: session.amount_total / 100,
      });
      
    } else {
      res.status(400).send("Payment failed or incomplete.");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error processing payment.");
  }
});
export default router;
