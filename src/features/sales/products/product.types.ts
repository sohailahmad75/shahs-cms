export interface Product {
  id: string;
  name: string;
  itemCode?: string | null;
  categoryId?: string | null;
  description?: string | null;
  salesPrice: number;
  salesVatInclusive?: boolean;
  salesVatRate?: number;
  salesVatCode?: string;
  salesDescription?: string;
  incomeAccount?: string;
  purchaseCost: number;
  purchaseTaxInclusive?: boolean;
  purchaseTaxRate?: number;
  purchaseTaxCode?: string;
  purchaseDescription?: string;
  expenseAccount?: string;
  preferredSupplierId?: string;
  productType: string
  supplierId?: string


  stockAssetAccount?: string;
  reorderPoint?: number;
  initialQuantity?: number;
  initialAsOf?: string;


  unit?: string;
  s3Key?: string | null;
  isInventoryItem: boolean;
  isActive: boolean;

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
