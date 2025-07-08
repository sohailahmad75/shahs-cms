// roles.ts

export type UserRole = 1 | 2 | 3 | 4;

export const USER_ROLES: { value: UserRole; label: string }[] = [
  { value: 1, label: "Super Admin" },
  { value: 2, label: "Admin" },
  { value: 3, label: "Store Manager" },
  { value: 4, label: "Staff" },
];

export const ROLES = {
  SUPER_ADMIN: 1,
  ADMIN: 2,
  STORE_MANAGER: 3,
  STAFF: 4,
} as const;

export interface SidebarSubMenuItem {
  id: string;
  name: string;
  link: string;
  roles: UserRole[];
}
