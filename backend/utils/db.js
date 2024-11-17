import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const validateDbConnection = async () => {
  try {
    await prisma.$connect();
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database connection failed", error);
  } finally {
    await prisma.$disconnect();
  }
};

validateDbConnection();
export default prisma;