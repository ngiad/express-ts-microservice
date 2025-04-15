import { z } from "zod";
import { BaseCondSchema } from "../../../../share/model/base-cond";
import { BranchStatus } from "../../../branch/model";


const stringOrRecord = z.union([z.string(), z.record(z.any()) as any]);
const uuidOrRecord = z.union([z.string().uuid(), z.record(z.any()) as any]);
const dateOrRecord = z.union([z.coerce.date(), z.record(z.any()) as any]);

function asArrayOrSingle<T extends z.ZodTypeAny>(schema: T) {
  return z.union([schema, z.array(schema)]);
}

export const CartCondSchema = BaseCondSchema.merge(z.object({
    id: asArrayOrSingle(uuidOrRecord).optional(),
    userId: asArrayOrSingle(uuidOrRecord).optional(),
    productId : asArrayOrSingle(uuidOrRecord).optional(),
    attributes : asArrayOrSingle(stringOrRecord).optional(),
    quantity: z.union([z.number(), z.record(z.any()) as any]).optional(),
    branchId : asArrayOrSingle(uuidOrRecord).optional(),
    createdAt: asArrayOrSingle(dateOrRecord).optional(),
    updatedAt: asArrayOrSingle(dateOrRecord).optional(),
}))

export type CartCondType = z.infer<typeof CartCondSchema>


export const CartCreateSchema = z.object({
    userId : z.string().uuid(),
    productId : z.string().uuid(),
    branchId : z.string(),
    attributes : z.string().nullable().optional().default(""),
    quantity : z.number().min(1).default(1),
})

export type CartCreateType = z.infer<typeof CartCreateSchema>

export const CartUpdateSchema = z.object({
    userId : z.string().optional(),
    attributes : z.string().optional(),
    quantity : z.number().min(1).default(1).optional(),
})

export type CartUpdateType = z.infer<typeof CartUpdateSchema>