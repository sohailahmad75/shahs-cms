// roles.ts

export type UserRole = "super-admin" | "admin" | "store-manager" | "staff";

export const USER_ROLES: { value: UserRole; label: string }[] = [
  { value: "super-admin", label: "Super Admin" },
  { value: "admin", label: "Admin" },
  { value: "store-manager", label: "Store Manager" },
  { value: "staff", label: "Staff" },
];

export const ROLES = {
  SUPER_ADMIN: 1,
  ADMIN: 2,
  STORE_MANAGER: 3,
  STAFF: 4,
} as const;
