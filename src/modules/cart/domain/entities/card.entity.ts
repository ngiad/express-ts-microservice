import { z } from "zod";

export const CartItemBranchSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2),
  image: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  location: z.string().min(2, "location must be at least 2 characters").nullable().optional(),
  tagLine : z.string().nullable().optional()
})

export type CartItemBranchType = z.infer<typeof CartItemBranchSchema>;

export const CartProductSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  image: z.string().optional(),
  price: z.coerce.number().optional(),
  discount: z.coerce.number().optional(),
  quantity: z.number().min(1).default(1),
  branchId: z.string().optional(),
});

export type CartProductType = z.infer<typeof CartProductSchema>;

export const CartSchema = z.object({
  id: z.string().uuid(),
  userId: z.string(),
  productId: z.string(),
  attributes: z.string().nullable().optional().default(""),
  quantity: z.number().min(1).default(1),
});

export type CartType = z.infer<typeof CartSchema>;

export type CartResponseType = CartType & {
  product?: CartProductType;
  branch?: CartItemBranchType;
};
