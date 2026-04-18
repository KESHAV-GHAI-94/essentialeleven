import { z } from "zod";

export const UserSchema = z.object({
  id: z.string().optional(),
  email: z.string().email("Invalid email address"),
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  role: z.enum(["USER", "ADMIN", "VENDOR"]).default("USER"),
});
