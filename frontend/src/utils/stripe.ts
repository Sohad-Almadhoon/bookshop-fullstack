import { loadStripe, Stripe } from "@stripe/stripe-js";

// Publishable keys are safe in the browser, but they must not be hard-coded:
// the test key used to ship in the production bundle.
const publishableKey = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || "";

const stripePromise: Promise<Stripe | null> = publishableKey
  ? loadStripe(publishableKey)
  : Promise.resolve(null);

export default stripePromise;
