import express from "express";
import prisma from "../utils/db.js";
const router = express.Router();
router.get("/success", async (req, res) => {
  const { session_id } = req.query;

  try {
    // Retrieve the session to confirm payment status
    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status === "paid") {
      // Payment is successful, update the user attribute using Prisma
      const userId = session.customer; // Assuming the customer ID is stored in the session

      // Fetch user using Prisma based on Stripe customer ID
      const user = await prisma.users.findUnique({
        where: { stripeId: userId },
      });

      if (user) {
        // Update the user's 'hasPaid' field
        await prisma.users.update({
          where: { id: user.id },
          data: { hasPaid: true },
        });
      } else {
        console.log("User not found");
      }

      // Render success page or redirect
      res.render("success", { user });
    } else {
      res.status(400).send("Payment failed or incomplete.");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error processing payment.");
  }
});
export default router;