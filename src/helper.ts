// roles.ts

export type UserRole = "super-admin" | "admin" | "store-manager" | "staff";

export const USER_ROLES: { value: UserRole; label: string }[] = [
  { value: "super-admin", label: "Super Admin" },
  { value: "admin", label: "Admin" },
  { value: "store-manager", label: "Store Manager" },
  { value: "staff", label: "Staff" },
];

export const ROLES = {
  SUPER_ADMIN: "super-admin",
  ADMIN: "admin",
  STORE_MANAGER: "store-manager",
  STAFF: "staff",
} as const;
