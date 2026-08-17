import express from "express";
import verifyToken from "../middlewares/verifyToken.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import prisma from "../utils/db.js";
import env from "../utils/env.js";
import { getStripe, requireStripe } from "../utils/stripe.js";
import { notFound } from "../utils/httpError.js";

const router = express.Router();

const SUBSCRIPTION_AMOUNT_CENTS = 500;

/** Only redirect back to origins we own. */
const resolveClientUrl = (req) => {
  const origin = req.headers.origin;
  if (origin && env.clientUrls.includes(origin)) return origin;
  return env.clientUrls[0];
};

router.post(
  "/",
  verifyToken,
  requireStripe,
  asyncHandler(async (req, res) => {
    const user = await prisma.users.findUnique({
      where: { id: req.user.id },
      select: { id: true, email: true, has_paid: true },
    });
    if (!user) throw notFound("User not found.");

    if (user.has_paid) {
      return res.status(200).json({ alreadyPaid: true });
    }

    const clientUrl = resolveClientUrl(req);

    const session = await getStripe().checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: "Bookshop Subscription" },
            unit_amount: SUBSCRIPTION_AMOUNT_CENTS,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${clientUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${clientUrl}/tree`,
      customer_email: user.email,
      // Bind the session to the account so the webhook and the success page
      // can only ever unlock the user who actually paid.
      client_reference_id: String(user.id),
      metadata: { userId: String(user.id) },
    });

    res.status(200).json({ id: session.id, url: session.url });
  })
);

export default router;
