import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Verify the connection once at boot. We deliberately do NOT call $disconnect()
// here: the client is a long lived singleton used by every request.
const validateDbConnection = async () => {
  try {
    await prisma.$connect();
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database connection failed", error);
    process.exit(1);
  }
};

validateDbConnection();

// Close the pool cleanly when the process is asked to stop.
const shutdown = async () => {
  await prisma.$disconnect();
  process.exit(0);
};
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

export default prisma;
