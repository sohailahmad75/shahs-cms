export interface BankDetail {
  id: string;
  ownerId: string;
  ownerType: number;
  accountNumber: string;
  sortCode: string;
  bankName: string;
  accountHolderName?: string | null;
  iban?: string | null;
  swiftCode?: string | null;
  storeId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Store {
  id: string; // required because this comes from the backend
  name: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  postcode: string;
  country: string;
  uberStoreId?: string;
  deliverooStoreId?: string;
  justEatStoreId?: string;
  vatNumber?: string;
  googlePlaceId?: string;
  fsaId?: string;
  companyName: string;
  companyNumber: string;
  storeType: number;
  bankDetails: BankDetail[];
}

export interface CreateStoreDto {
  name: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  postcode: string;
  country: string;
  uberStoreId?: string;
  deliverooStoreId?: string;
  justEatStoreId?: string;
  vatNumber?: string;
  googlePlaceId?: string;
  fsaId?: string;
  companyName: string;
  companyNumber: string;
  storeType: number;
  bankDetails: {
    bankName: string;
    accountNumber: string;
    sortCode: string;
  }[];
}

export interface UpdateStoreDto extends Partial<CreateStoreDto> {
  id: string;
}
