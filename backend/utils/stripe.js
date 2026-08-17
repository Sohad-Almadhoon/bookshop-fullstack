import Stripe from "stripe";
import env from "./env.js";

// Lazily built so a missing key produces a clean 503 instead of crashing the
// process at import time.
let client = null;

export const isStripeConfigured = Boolean(env.stripeSecretKey);

export const getStripe = () => {
  if (!isStripeConfigured) return null;
  if (!client) {
    client = new Stripe(env.stripeSecretKey, { apiVersion: "2024-11-20.acacia" });
  }
  return client;
};

export const requireStripe = (req, res, next) => {
  if (!isStripeConfigured) {
    return res.status(503).json({ error: "Payments are not configured on this server." });
  }
  next();
};

export default getStripe;
