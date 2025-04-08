import { z } from "zod";
import { ErrProductName } from "./error";
import { ErrBranchNameTooShort } from "../../branch/model/error";

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
  quantity: z.number().optional(),
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


export const ProductBranchSchema = z.object({
    id: z.string().uuid(),
    name: z.string().min(2, ErrBranchNameTooShort),
    image: z.string().nullable().optional(),
    description: z.string().nullable().optional(),
    location: z.string().min(2, "location must be at least 2 characters").nullable().optional(),
    tagLine : z.string().nullable().optional()
})

export type ProductBranchType = z.infer<typeof ProductBranchSchema>;

export const ProductCategorySchema = z.object({
    id: z.string().uuid(),
    name: z.string().min(2, ErrBranchNameTooShort),
    image: z.string().nullable().optional(),
    description: z.string().nullable().optional(),
    position: z.number().min(0, "invalid position").default(0),
    parentId: z.string().nullable().optional()
})
export type ProductCategoryType = z.infer<typeof ProductCategorySchema>;


export type ProductFullDataType = ProductType & { branch? : ProductBranchType}  & {category? : ProductCategoryType};
