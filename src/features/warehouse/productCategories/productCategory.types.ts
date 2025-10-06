export interface ProductCategory {
  id: string;
  sku: string;
  name: string;
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
