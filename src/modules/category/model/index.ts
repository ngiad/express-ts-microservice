import { z } from "zod";

export enum CategoryStatus {
  Active = "active",
  Inactive = "inactive",
  Deleted = "deleted",
}

export const CategorySchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2, "name must be at least 2 characters"),
  image: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  position: z.number().min(0, "invalid position").default(0),
  parentId: z.string().nullable().optional(),
  status: z.nativeEnum(CategoryStatus),
  createdAt: z.preprocess(
    (val) => (typeof val === "string" || val instanceof Date ? new Date(val) : undefined),
    z.date()
  ),
  
  updatedAt: z.preprocess(
    (val) => (typeof val === "string" || val instanceof Date ? new Date(val) : undefined),
    z.date()
  ),
});

export type CategoryType = z.infer<typeof CategorySchema>;
