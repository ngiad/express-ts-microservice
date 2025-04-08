import { z } from "zod";
import { CategoryStatus } from ".";
import { BaseCondSchema } from "../../../share/model/base-cond";

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



const stringOrRecord = z.union([z.string(), z.record(z.any()) as any]);
const uuidOrRecord = z.union([z.string().uuid(), z.record(z.any()) as any]);
const statusOrRecord = z.union([z.nativeEnum(CategoryStatus), z.record(z.any()) as any]);

function asArrayOrSingle<T extends z.ZodTypeAny>(schema: T) {
  return z.union([schema, z.array(schema)]);
}
export const CategoryCondSchema = BaseCondSchema.merge(
  z.object({
    name: asArrayOrSingle(stringOrRecord).optional(),
    parentId: asArrayOrSingle(uuidOrRecord).optional(),
    status: asArrayOrSingle(statusOrRecord).optional(),
  })
);

export type CategoryCondType = z.infer<typeof CategoryCondSchema>;