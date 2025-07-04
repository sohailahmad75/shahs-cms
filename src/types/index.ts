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
};

export type ModifierOption = {
  id?: string;
  name: string;
  price: number;
  modifierId?: string;
  deliveryPrice: number;
};
