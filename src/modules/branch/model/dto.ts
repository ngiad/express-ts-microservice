import { z } from "zod";
import { BranchStatus } from ".";
import { ErrBranchNameTooShort } from "./error";
import { BaseCondSchema } from "../../../share/model/base-cond";

export const BranchCreateSchema = z.object({
  name: z.string().min(2, ErrBranchNameTooShort.message),
  image: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  location: z.string().min(2, "location must be at least 2 characters").optional(),
  tagLine: z.string().nullable().optional(),
});

export type BranchCreateType = z.infer<typeof BranchCreateSchema>;

export const BranchUpdateSchema = z.object({
  name: z.string().min(2, ErrBranchNameTooShort.message).optional(),
  image: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  location: z.string().min(2, "location must be at least 2 characters").optional(),
  tagLine: z.string().nullable().optional(),
  status: z.nativeEnum(BranchStatus).optional(),
});

export type BranchUpdateType = z.infer<typeof BranchUpdateSchema>;


const stringOrRecord = z.union([z.string(), z.record(z.any()) as any]);
const uuidOrRecord = z.union([z.string().uuid(), z.record(z.any()) as any]);
const nullableStringOrRecord = z.union([z.string().nullable(), z.record(z.any()) as any]);
const statusOrRecord = z.union([z.nativeEnum(BranchStatus), z.record(z.any()) as any]);
const dateOrRecord = z.union([z.coerce.date(), z.record(z.any()) as any]);

function asArrayOrSingle<T extends z.ZodTypeAny>(schema: T) {
  return z.union([schema, z.array(schema)]);
}

export const BranchCondSchema = BaseCondSchema.merge(
  z.object({
    id: asArrayOrSingle(uuidOrRecord).optional(),
    name: asArrayOrSingle(stringOrRecord).optional(),
    description: asArrayOrSingle(nullableStringOrRecord).optional(),
    location: asArrayOrSingle(nullableStringOrRecord).optional(),
    tagLine: asArrayOrSingle(nullableStringOrRecord).optional(),
    status: asArrayOrSingle(statusOrRecord).optional(),
    createdAt: asArrayOrSingle(dateOrRecord).optional(),
    updatedAt: asArrayOrSingle(dateOrRecord).optional(),
  })
);

export type BranchCondType = z.infer<typeof BranchCondSchema>;