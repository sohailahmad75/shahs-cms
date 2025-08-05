export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: string;
  image: string;
  deliveryPrice: number;
};

export type MenuCategory = {
  id: string;
  name: string;
  description?: string;
  image?: string;
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
  modificationType: string;
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
