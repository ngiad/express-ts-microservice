import { z } from "zod";

export const NotificationCartBranchSchema = z.object({
  id: z.string().uuid(),
  branchId: z.string().uuid(),
  cartId: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type NotificationCartBranchType = z.infer<typeof NotificationCartBranchSchema>;

export const NotificationCartProductSchema = z.object({
    id: z.string(),
    name: z.string().optional(),
    image: z.string().optional(),
    price: z.coerce.number().optional(),
    discount: z.coerce.number().optional(),
    quantity: z.number().min(1).default(1),
    branchId: z.string().optional(),
});

export type NotificationCartProductType = z.infer<typeof NotificationCartProductSchema>;

export type NotificationCartProductBranchType = NotificationCartBranchType & {
    product?: NotificationCartProductType;
}