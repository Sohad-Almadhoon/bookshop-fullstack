import { z } from "zod";
export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string(),
    role: z.string().min(1, "Role is required"),
    generes: z
      .array(z.string().min(1, "Genere name must not be empty"))
      .min(1, "At least one genere is required"),
  }),
});
export const loginSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
  }),
});
