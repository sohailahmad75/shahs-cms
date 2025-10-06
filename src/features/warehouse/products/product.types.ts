export interface Product {
  id: string;
  name: string;
  itemCode?: string | null;
  categoryId?: string | null;
  description?: string | null;
  salesPrice: number;
  salesVatInclusive?: boolean;
  salesVatRate?: number;
  incomeAccount?: string;
  purchaseCost: number;
  purchaseTaxInclusive?: boolean;
  purchaseTaxRate?: number;
  expenseAccount?: string;
  stockAssetAccount?: string;
  reorderPoint?: number;
  unit?: string;
  s3Key?: string | null;
  isInventoryItem: boolean;
  isActive: boolean;
  type: "stock" | "non-stock" | "service";
  createdAt?: string;
  updatedAt?: string;
}

export interface PaginatedMeta {
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}
export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginatedMeta;
}
