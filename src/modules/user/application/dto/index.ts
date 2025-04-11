import { z } from "zod";
import { BaseCondSchema } from "../../../../share/model/base-cond";

export enum UserStatus {
  Active = "active",
  Inactive = "inactive",
  Deleted = "deleted",
  Banner = "banner",
  Featured = "featured",
}

export enum UserRole {
  BRANCH = "branch",
  ADMIN = "admin",
  USER = "user",
}

export const UserCreateSchema = z.object({
  name: z.string().min(1),
  image: z.string().nullable().optional(),
  email: z.string().email(),
  username: z.string().min(6),
  password: z.string().min(8),
  role: z.nativeEnum(UserRole).optional(),
  location: z.string().optional().nullable(),
  bio: z.string().optional().nullable(),
});
export type UserCreateType = z.infer<typeof UserCreateSchema>;

export const UserUpdateProfileSchema = z.object({
  name: z.string().min(1).optional(),
  image: z.string().nullable().optional(),
  password: z.string().min(8).optional(),
  location: z.string().optional().nullable(),
  bio: z.string().optional().nullable(),
});

export type UserUpdateProfileType = z.infer<typeof UserUpdateProfileSchema>;

export const UserUpdatePasswordSchema = z.object({
  password: z.string().min(8),
});
export type UserUpdatePasswordType = z.infer<typeof UserUpdatePasswordSchema>;

const stringOrRecord = z.union([z.string(), z.record(z.any()) as any]);
const uuidOrRecord = z.union([z.string().uuid(), z.record(z.any()) as any]);
const nullableStringOrRecord = z.union([
  z.string().nullable(),
  z.record(z.any()) as any,
]);
const statusOrRecord = z.union([
  z.nativeEnum(UserStatus),
  z.record(z.any()) as any,
]);
const dateOrRecord = z.union([z.coerce.date(), z.record(z.any()) as any]);

function asArrayOrSingle<T extends z.ZodTypeAny>(schema: T) {
  return z.union([schema, z.array(schema)]);
}

export const UserCondSchema = BaseCondSchema.merge(
  z.object({
    id: asArrayOrSingle(uuidOrRecord).optional(),
    name: asArrayOrSingle(stringOrRecord).optional(),
    bio: asArrayOrSingle(nullableStringOrRecord).optional(),
    location: asArrayOrSingle(nullableStringOrRecord).optional(),
    username: asArrayOrSingle(nullableStringOrRecord).optional(),
    email: asArrayOrSingle(nullableStringOrRecord).optional(),
    status: asArrayOrSingle(statusOrRecord).optional(),
    createdAt: asArrayOrSingle(dateOrRecord).optional(),
    updatedAt: asArrayOrSingle(dateOrRecord).optional(),
    role: asArrayOrSingle(stringOrRecord).optional(),
  })
);

export type UserCondType = z.infer<typeof UserCondSchema>;

export const UserUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  image: z.string().nullable().optional(),
  email: z.string().email().optional().nullable(),
  password: z.string().min(8).optional(),
  location: z.string().optional().nullable(),
  bio: z.string().optional().nullable(),
  status: z.nativeEnum(UserStatus).optional(),
  role: z.nativeEnum(UserRole).optional(),
});

export type UserUpdateType = z.infer<typeof UserUpdateSchema>;

export const UserResponseSchema = z.object({
  name: z.string().min(1).optional(),
  image: z.string().nullable().optional(),
  email: z.string().email().optional().nullable(),
  username: z.string().min(6),
  role: z.nativeEnum(UserRole).optional(),
  location: z.string().optional().nullable(),
  bio: z.string().optional().nullable(),
  id: z.string().uuid(),
  status: z.nativeEnum(UserStatus),
});

export type UserResponseType = z.infer<typeof UserResponseSchema>;
