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

export const BranchCondSchema = BaseCondSchema.merge(
  z.object({
    id: z.union([z.string().uuid(), z.record(z.any()) as any]).optional(),
    name: z.union([z.string(), z.record(z.any()) as any]).optional(),
    description: z.union([z.string().nullable(), z.record(z.any()) as any]).optional(),
    location: z.union([z.string().nullable(), z.record(z.any()) as any]).optional(),
    tagLine: z.union([z.string().nullable(), z.record(z.any()) as any]).optional(),
    status: z.union([z.nativeEnum(BranchStatus), z.record(z.any()) as any]).optional(),
    createdAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional(),
  })
);

export type BranchCondType = z.infer<typeof BranchCondSchema>;