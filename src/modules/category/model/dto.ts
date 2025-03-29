import { z } from "zod";
import { CategoryStatus } from ".";

export const CategoryCreateSchema = z.object({
  name: z.string().min(2, "name must be at least 2 characters"),
  image: z.string().optional(),
  description: z.string().optional(),
  parentId: z.string().nullable().optional(),
});

export type CategoryCreateType = z.infer<typeof CategoryCreateSchema>;

export const CategoryUpdateSchema = z.object({
  name: z.string().min(2, "name must be at least 2 characters").optional(),
  image: z.string().optional(),
  description: z.string().optional(),
  parentId: z.string().nullable().optional(),
  status: z.nativeEnum(CategoryStatus).optional(),
});

export type CategoryUpdateType = z.infer<typeof CategoryUpdateSchema>;

export const CategoryCondSchema = z.object({
  name: z.string().min(2, "name must be at least 2 characters").optional(),
  parentId: z.string().optional(),
  status: z.nativeEnum(CategoryStatus).optional(),
});

export type CategoryCondType = z.infer<typeof CategoryCondSchema>;