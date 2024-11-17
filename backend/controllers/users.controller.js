import bcrypt from "bcrypt";
import prisma from "../utils/db.js";

const createUser = async (req, res) => {
  const { name, email, password, role } = req.body;
  if (![name, email, password, role].every(Boolean)) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create a new user
    const user = await prisma.users.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
    });
    res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      created_at: user.created_at,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creating user" });
  }
};
const getUsers = async (req, res) => {
  try {
    const users = await prisma.users.findMany();
    if (users.length === 0) {
      console.log("No users found");
      return [];
    }

    console.log("Users found:", users);
    return res.status(200).send(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};
export { createUser, getUsers };
