import type { Meta } from "../types";

export type MenuItem = {
  id?: string;
  name: string;
  description: string;
  price: string;
  s3Key: string;
  deliveryPrice: string;
  signedUrl?: string;
  tags?: string | null;
  categoryName?: string | null;
  category?: { id: string; name: string } | null;
  categoryId?: string;
  order?: number;
};

export type MenuCategory = {
  id: string;
  name: string;
  description?: string;
  s3Key: string;
  signedUrl?: string;
  items?: MenuItem[] | undefined;
  menuId: string;
  categoryId: string;
};

export type MenuModifier = {
  id?: string;
  name: string;
  description: string;
  minSelection: number;
  maxSelection: number;
  isRequired: boolean;
  isMoreOnce: boolean;
  items: string[]; // item IDs
  options: ModifierOption[];
  modificationTypeId: string;
  order?: number;
};

export type ModifierOption = {
  id?: string;
  name: string;
  price: number;
  s3Key: string;
  signedUrl?: string;
  modifierId?: string;
  deliveryPrice: number;
};

export interface StoreBasicInfo {
  email: string;
  id: string;
  name: string;
  companyName: string;
}

export interface StoreMenu {
  isPublished: boolean;
  id: number;
  storeId: string;
  menuId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  store: StoreBasicInfo;
}

export interface Menu {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  s3Key: string;
  createdAt: string;
  updatedAt: string;
  storeMenus: StoreMenu[];
  signedUrl?: string;
  storeCount?: number;
}
export interface MenuItemsListResponse {
  data: MenuItem[];
  meta: Meta; // { total, page, perPage, totalPages }
}
export interface GetMenuItemsArgs {
  menuId: string;
  page?: number;
  perPage?: number;
  query?: string;
  categoryId?: string; // optional server-side filter
  sort?: "order" | "name" | "price" | "createdAt";
  sortDir?: SortDir;
}

export type UpdateMenuItemPayload = Partial<{
  name: string;
  description?: string;
  price: number;
  deliveryPrice: number;
  categoryId: string;
  s3Key: string; // '' to clear; omit to keep
  isAvailable: boolean;
  tags: string[];
  dietaryTags: string[];
  taxRate: number;
}>;
