import { z } from "zod";
import { ErrProductName } from "./error";

export enum ProductStatus {
    Active = "active",
    Inactive = "inactive",
    Deleted = "deleted",
    Banner = "banner",
    Featured = "featured",
    BestSeller = "best-seller",
    NewArrival = "new-arrival",
    OnSale = "on-sale",
    Trending = "trending",
    Recommended = "recommended",
}



export const ProductSchema = z.object({
  id: z.string({message : ErrProductName}).uuid(),
  name: z.string(),
  image: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  location: z
    .string()
    .optional(),
  tagLine: z.string().nullable().optional(),
  status: z.nativeEnum(ProductStatus),
  createdAt: z.preprocess(
    (val) =>
      typeof val === "string" || val instanceof Date
        ? new Date(val)
        : undefined,
    z.date()
  ),
  updatedAt: z.preprocess(
    (val) =>
      typeof val === "string" || val instanceof Date
        ? new Date(val)
        : undefined,
    z.date()
  ),
  branchId: z.string().uuid().optional(),
  categoryId: z.string().uuid().optional(),
  price: z.number().optional(),
  discount: z.number().optional(),
  stock: z.number().optional(),
  rating: z.number().optional(),
  isFeatured: z.boolean().optional(),
  isBestSeller: z.boolean().optional(),
  isNewArrival: z.boolean().optional(),
  isOnSale: z.boolean().optional(),
  isTrending: z.boolean().optional(),
  isRecommended: z.boolean().optional(),
  isPopular: z.boolean().optional(),
  isLimitedEdition: z.boolean().optional(),
});
export type ProductType = z.infer<typeof ProductSchema>;
