import { z } from "zod";

export const paginSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(9999).default(20),
  total: z.coerce.number().int().min(0).default(0).optional(),
});

export type pagingDTO = z.infer<typeof paginSchema>;