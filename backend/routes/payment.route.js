import express from "express";
import prisma from "../utils/db.js";
import env from "../utils/env.js";
import verifyToken from "../middlewares/verifyToken.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import { getStripe, requireStripe } from "../utils/stripe.js";
import { badRequest, forbidden } from "../utils/httpError.js";

const router = express.Router();

const markUserAsPaid = (userId) =>
  prisma.users.update({ where: { id: userId }, data: { has_paid: true } });

/**
 * Called by the browser right after the Stripe redirect.
 * Requires a session AND that the checkout session belongs to that user, so a
 * stolen/guessed session_id cannot unlock somebody else's account.
 */
router.get(
  "/success",
  verifyToken,
  requireStripe,
  asyncHandler(async (req, res) => {
    const { session_id: sessionId } = req.query;
    if (!sessionId || typeof sessionId !== "string") {
      throw badRequest("session_id is required.");
    }

    const session = await getStripe().checkout.sessions.retrieve(sessionId);

    if (String(session.client_reference_id) !== String(req.user.id)) {
      throw forbidden("This payment session does not belong to your account.");
    }

    if (session.payment_status !== "paid") {
      throw badRequest("Payment failed or incomplete.");
    }

    await markUserAsPaid(req.user.id);

    res.status(200).json({
      has_paid: true,
      amountTotal: (session.amount_total ?? 0) / 100,
    });
  })
);

/**
 * Source of truth for payments: Stripe calls this even if the user closes the
 * tab before the redirect. Mounted with a raw body parser in server.js.
 * Disabled (503) until STRIPE_WEBHOOK_SECRET is configured.
 */
router.post(
  "/webhook",
  requireStripe,
  asyncHandler(async (req, res) => {
    if (!env.stripeWebhookSecret) {
      return res.status(503).json({ error: "Webhook is not configured." });
    }

    const signature = req.headers["stripe-signature"];
    let event;
    try {
      event = getStripe().webhooks.constructEvent(
        req.body,
        signature,
        env.stripeWebhookSecret
      );
    } catch (error) {
      return res.status(400).json({ error: `Webhook signature failed: ${error.message}` });
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const userId = Number(session.client_reference_id ?? session.metadata?.userId);
      if (Number.isInteger(userId) && session.payment_status === "paid") {
        await markUserAsPaid(userId);
      }
    }

    res.status(200).json({ received: true });
  })
);

export default router;
