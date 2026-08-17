import { z } from "zod";

const email = z
  .string()
  .trim()
  .toLowerCase()
  .email("Invalid email address")
  .max(255, "Email is too long");

export const registerSchema = z.object({
  body: z.object({
    name: z.string().trim().min(1, "Name is required").max(60, "Name is too long"),
    email,
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(72, "Password must be at most 72 characters"),
    role: z.string().trim().min(1, "Role is required").max(40),
    generes: z
      .array(z.string().trim().min(1, "Genre name must not be empty").max(40))
      .min(1, "At least one genre is required")
      .max(20, "Too many genres selected"),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email,
    password: z.string().min(1, "Password is required"),
  }),
});
