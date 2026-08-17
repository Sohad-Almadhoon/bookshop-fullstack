// Loaded first by server.js so every module that reads process.env at import
// time (Stripe, Cloudinary) sees the values. ESM evaluates imports in order,
// so this module MUST stay the first import of server.js.
import "dotenv/config";

const REQUIRED = ["DATABASE_URL", "JWT_SECRET"];

const missing = REQUIRED.filter((key) => !process.env[key]);
if (missing.length) {
  console.error(
    `Missing required environment variables: ${missing.join(
      ", "
    )}. Copy .env.example to .env and fill them in.`
  );
  process.exit(1);
}

if (process.env.JWT_SECRET.length < 32) {
  console.warn(
    "JWT_SECRET is shorter than 32 characters. Generate a stronger one with:\n" +
      '  node -e "console.log(require(\'crypto\').randomBytes(48).toString(\'hex\'))"'
  );
}

const optional = ["STRIPE_SECRET_KEY", "CLOUD_NAME", "CLOUD_API_KEY", "CLOUD_API_SECRET"];
const missingOptional = optional.filter((key) => !process.env[key]);
if (missingOptional.length) {
  console.warn(
    `Optional environment variables not set: ${missingOptional.join(
      ", "
    )}. Related features (payments / uploads) will return 503.`
  );
}

export const env = {
  port: Number(process.env.PORT) || 5000,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  clientUrls: (process.env.CLIENT_URLS || "http://localhost:3000")
    .split(",")
    .map((url) => url.trim())
    .filter(Boolean),
  stripeSecretKey: process.env.STRIPE_SECRET_KEY || "",
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET || "",
  isProduction: process.env.NODE_ENV === "production",
};

export default env;
