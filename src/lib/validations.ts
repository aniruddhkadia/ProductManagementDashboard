import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
  expiresInMins: z.number().int().positive().optional(),
});

export type LoginSchema = z.infer<typeof loginSchema>;

export const productSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.number().positive("Price must be a positive number"),
  discountPercentage: z.number().min(0).max(100),
  stock: z.number().int().nonnegative("Stock must be a non-negative integer"),
  brand: z.string().min(1, "Brand is required"),
  category: z.string().min(1, "Category is required"),
  thumbnail: z.string().min(1, "Thumbnail is required"),
  images: z.array(z.string()),
});

export type ProductSchema = z.infer<typeof productSchema>;
