import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../utils/db.js";
import env from "../utils/env.js";
import { selfUserSelect } from "../utils/selects.js";
import { unauthorized, HttpError } from "../utils/httpError.js";

const signToken = (user) =>
  jwt.sign({ id: user.id }, env.jwtSecret, { expiresIn: env.jwtExpiresIn });

// Compared against when the email is unknown, so a failed login costs the same
// time whether or not the account exists (timing based user enumeration).
const DUMMY_HASH = bcrypt.hashSync("unknown-account-placeholder", 12);

const register = async (req, res) => {
  const { name, email, password, role, generes } = req.body;

  const existingUser = await prisma.users.findUnique({
    where: { email },
    select: { id: true },
  });
  if (existingUser) {
    throw new HttpError(409, "User already exists with this email");
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma.users.create({
    data: { name, email, password: hashedPassword, role, generes },
    select: selfUserSelect,
  });

  // Log the user straight in so they do not have to retype their credentials.
  res.status(201).json({ token: signToken(user), user });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.users.findUnique({ where: { email } });

  // Same response for "unknown email" and "wrong password" so the endpoint
  // cannot be used to discover which emails are registered.
  if (!user) {
    await bcrypt.compare(password, DUMMY_HASH);
    throw unauthorized("Incorrect email or password.");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw unauthorized("Incorrect email or password.");
  }

  const { password: _password, email: userEmail, ...rest } = user;

  res.status(200).json({
    token: signToken(user),
    user: { ...rest, email: userEmail },
  });
};

export { register, login };
