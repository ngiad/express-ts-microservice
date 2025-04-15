import { z } from "zod";

export const CartProductSchema = z.object({
  id: z.string(),
  productId: z.string(),
  name: z.string(),
  image: z.string(),
  price: z.number(),
  discount: z.number().optional(),
  quantity: z.number().min(1).default(1),
  branchId: z.string(),
});

export type CartProductType = z.infer<typeof CartProductSchema>;

export const CartSchema = z.object({
  id: z.string().uuid(),
  userId: z.string(),
  productId: z.string(),
  attributes: z.string().nullable().optional().default(""),
  quantity: z.number().min(1).default(1),
  branchId: z.string(),
});

export type CartType = z.infer<typeof CartSchema>;

export const CartBranchSchema = z.object({
  id: z.string(),
  name: z.string().min(2),
  image: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  location: z
    .string()
    .min(2, "location must be at least 2 characters")
    .optional(),
  tagLine: z.string().nullable().optional(),
});
export type CartBranchType = z.infer<typeof CartBranchSchema>;

export type CartResponseType = CartType & {
  branch?: CartBranchType;
  product?: CartProductType;
};
