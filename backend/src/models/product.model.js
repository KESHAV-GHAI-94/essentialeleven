import { z } from "zod";

export const ProductSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Product name is required"),
  price: z.number().positive("Price must be positive"),
  category: z.string(),
  image: z.string().url().optional(),
  description: z.string().optional(),
});
