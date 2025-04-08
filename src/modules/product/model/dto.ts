import { z } from "zod";
import { ProductStatus } from ".";
import { BaseCondSchema } from "../../../share/model/base-cond";
import { ErrProductName } from "./error";


export const ProductCreateSchema = z.object({
  name: z.string({message: ErrProductName}),
  image: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  location: z
    .string()
    .optional(),
  tagLine: z.string().nullable().optional(),
  branchId: z.string().uuid().optional(),
  categoryId: z.string().uuid().optional(),
  price: z.number().optional(),
  discount: z.number().optional(),
  quantity: z.number().optional(),
});

export type ProductCreateType = z.infer<typeof ProductCreateSchema>;


export const ProductUpdateSchema = z.object({
  name: z.string().optional(),
  image: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  location: z
    .string()
    .optional(),
  tagLine: z.string().nullable().optional(),
  status: z.nativeEnum(ProductStatus).optional(),
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
  quantity: z.number().optional(),
});
export type ProductUpdateType = z.infer<typeof ProductUpdateSchema>;



// export const ProductCondSchema = BaseCondSchema.merge(
//     z.object({
//       id: BaseCondSchema,
//       name: BaseCondSchema,
//       image: BaseCondSchema,
//       description: BaseCondSchema,
//       location: BaseCondSchema,
//       tagLine: BaseCondSchema,
//       status: z.union([
//         BaseCondSchema,
//         z.nativeEnum(ProductStatus),
//         z.array(z.nativeEnum(ProductStatus)),
//       ]),
//       createdAt: BaseCondSchema,
//       updatedAt: BaseCondSchema,
//       branchId: BaseCondSchema,
//       categoryId: BaseCondSchema,
//       price: BaseCondSchema,
//       discount: BaseCondSchema,
//       stock: BaseCondSchema,
//       rating: BaseCondSchema,
//       isFeatured: BaseCondSchema,
//       isBestSeller: BaseCondSchema,
//       isNewArrival: BaseCondSchema,
//       isOnSale: BaseCondSchema,
//       isTrending: BaseCondSchema,
//       isRecommended: BaseCondSchema,
//       isPopular: BaseCondSchema,
//       isLimitedEdition: BaseCondSchema,
//     })
//   );
  
//   export type ProductCondType = z.infer<typeof ProductCondSchema>;



export const ProductCondSchema = BaseCondSchema.merge(
    z.object({
      id: z.union([z.string().uuid(), z.record(z.any()) as any]).optional(),
      name: z.union([z.string(), z.record(z.any()) as any]).optional(),
      image: z.union([z.string().nullable(), z.record(z.any()) as any]).optional(),
      description: z.union([z.string().nullable(), z.record(z.any()) as any]).optional(),
      location: z.union([z.string().nullable(), z.record(z.any()) as any]).optional(),
      tagLine: z.union([z.string().nullable(), z.record(z.any()) as any]).optional(),
      status: z.union([
        z.nativeEnum(ProductStatus),
        z.array(z.nativeEnum(ProductStatus)),
        z.record(z.any()) as any,
      ]).optional(),
      createdAt: z.union([z.coerce.date(), z.record(z.any()) as any]).optional(),
      updatedAt: z.union([z.coerce.date(), z.record(z.any()) as any]).optional(),
      branchId: z.union([z.string().uuid(), z.record(z.any()) as any]).optional(),
      categoryId: z.union([z.string().uuid(), z.record(z.any()) as any]).optional(),
      price: z.union([z.number(), z.record(z.any()) as any]).optional(),
      discount: z.union([z.number(), z.record(z.any()) as any]).optional(),
      stock: z.union([z.number(), z.record(z.any()) as any]).optional(),
      rating: z.union([z.number(), z.record(z.any()) as any]).optional(),
      isFeatured: z.union([z.boolean(), z.record(z.any()) as any]).optional(),
      isBestSeller: z.union([z.boolean(), z.record(z.any()) as any]).optional(),
      isNewArrival: z.union([z.boolean(), z.record(z.any()) as any]).optional(),
      isOnSale: z.union([z.boolean(), z.record(z.any()) as any]).optional(),
      isTrending: z.union([z.boolean(), z.record(z.any()) as any]).optional(),
      isRecommended: z.union([z.boolean(), z.record(z.any()) as any]).optional(),
      isPopular: z.union([z.boolean(), z.record(z.any()) as any]).optional(),
      isLimitedEdition: z.union([z.boolean(), z.record(z.any()) as any]).optional(),
    })
  );
  
  export type ProductCondType = z.infer<typeof ProductCondSchema>;
  




