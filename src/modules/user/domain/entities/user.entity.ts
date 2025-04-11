import { z } from "zod";


export enum UserRole{
  BRANCH = "branch",
  ADMIN = "admin",
  USER = "user"
}

export enum UserStatus {
    Active = "active",
    Inactive = "inactive",
    Deleted = "deleted",
    Banner = "banner",
    Featured = "featured",
}


export const UserSchema = z.object({
    name : z.string().min(1),
    image : z.string().nullable().optional(),
    email : z.string().email(),
    username: z.string().min(6),
    password: z.string().min(8),
    role :  z.nativeEnum(UserRole).optional(),
    location: z.string().optional().nullable(),
    bio: z.string().optional().nullable(),
    id: z.string().uuid(),
    status: z.nativeEnum(UserStatus),
    createdAt: z.preprocess(
        (val) => (typeof val === "string" || val instanceof Date ? new Date(val) : undefined),
        z.date()
      ),
      
      updatedAt: z.preprocess(
        (val) => (typeof val === "string" || val instanceof Date ? new Date(val) : undefined),
        z.date()
      ),
})

export type UserType = z.infer<typeof UserSchema>;



