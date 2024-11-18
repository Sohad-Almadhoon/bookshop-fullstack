import bcrypt from "bcrypt";
import prisma from "../utils/db.js";
import jwt from "jsonwebtoken";
const register = async (req, res) => {
  const { name, email, password, role, generes } = req.body;

  // Validate required fields
  if (
    ![name, email, password].every(
      (field) => typeof field === "string" && field.trim() !== ""
    )
  ) {
    return res
      .status(400)
      .json({
        error:
          "All fields (name, email, password, and role) are required and must be non-empty strings",
      });
  }
  try {
    // Check if user already exists
    const existingUser = await prisma.users.findUnique({
      where: { email },
    });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "User already exists with this email" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const user = await prisma.users.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        generes: generes || [], 
      },
    });

    const { password: _, ...userWithoutPassword } = user;

    res.status(201).json(userWithoutPassword);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creating user. Please try again." });
  }
};
const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }
  try {
    const user = await prisma.users.findUnique({
      where: { email },
    });
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }
    // Check the password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials." });
    }
    // Generate a JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "3d" }
    );
    return res.status(200).json({ message: "Login successful.", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error logging in" });
  }
};
const getUserByEmail = async (req, res) => {
  try {
    return res.status(200).send(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};
export { register, getUserByEmail, login };
