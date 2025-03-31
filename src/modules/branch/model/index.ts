import { z } from "zod";
import { ErrBranchNameTooShort } from "./error";

export enum BranchStatus {
  Active = "active",
  Inactive = "inactive",
  Deleted = "deleted",
  Banner = "banner",
  Featured = "featured",
}

export const BranchSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2, ErrBranchNameTooShort.message),
  image: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  location: z.string().min(2, "location must be at least 2 characters").optional(),
  tagLine : z.string().nullable().optional(),
  status: z.nativeEnum(BranchStatus),
  createdAt: z.preprocess(
    (val) => (typeof val === "string" || val instanceof Date ? new Date(val) : undefined),
    z.date()
  ),
  
  updatedAt: z.preprocess(
    (val) => (typeof val === "string" || val instanceof Date ? new Date(val) : undefined),
    z.date()
  ),
});

export type BranchType = z.infer<typeof BranchSchema>;
