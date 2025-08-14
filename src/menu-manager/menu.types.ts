import type { Meta } from "../types";

export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: string;
  s3Key: string;
  deliveryPrice: number;
  signedUrl?: string;
  tags?: string | null;
  categoryName?: string | null;
  category?: { id: string; name: string } | null;
};

export type MenuCategory = {
  id: string;
  name: string;
  description?: string;
  s3Key: string;
  signedUrl?: string;
  items?: MenuItem[] | undefined;
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
};

export type ModifierOption = {
  id?: string;
  name: string;
  price: number;
  modifierId?: string;
  deliveryPrice: number;
};

export interface StoreBasicInfo {
  email: any;
  id: string;
  name: string;
  companyName: string;
}

export interface StoreMenu {
  isPublished: any;
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
