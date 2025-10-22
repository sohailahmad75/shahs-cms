export interface Supplier {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  website?: string;
  notes?: string;
  currency: string;
  balance: number;
  isTaxable: boolean;
  defaultVatRate: number;
  contactPerson: string;
  paymentTerms: number;
  taxNumber?: string;
  bankDetails?: string;
  status: "active" | "inactive";
  createdAt?: string;
  updatedAt?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    perPage: number;
    totalPages: number;
  };
}
