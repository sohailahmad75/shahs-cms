export interface BankDetail {
  id?: string;
  accountNumber: string;
  sortCode: string;
  bankName: string;
}

export interface OpeningHour {
  day: string;
  open: string | null;
  close: string | null;
  closed: boolean;
}

export interface StoreDocument {
  documentType: string;
  fileS3Key: string;
  fileType: string;
  name: string;
  expiresAt?: string;
  remindBeforeDays?: number;
  fileUrl?: string;
}

export interface CreateStoreDto {
  storeBasicInfo: {
    name: string;
    email: string;
    phone: string;
    street: string;
    city: string;
    postcode: string;
    country: string;
    companyName: string;
    companyNumber: string;
    storeType: number;
  };
}

export interface UpdateStoreDto {
  id?: string;
  storeBasicInfo?: {
    name: string;
    email: string;
    phone: string;
    street: string;
    city: string;
    postcode: string;
    country: string;
    companyName: string;
    companyNumber: string;
    storeType: number;
  };
  storeBankDetails?: BankDetail[];
  storeAdditionalInfo?: {
    vatNumber?: string;
    googlePlaceId?: string;
    uberStoreId?: string;
    deliverooStoreId?: string;
    justEatStoreId?: string;
    fsaId?: string;
    lat?: number;
    lon?: number;
  };
  storeAvailability?: OpeningHour[];
  storeDocuments?: StoreDocument[];
}

export interface Store {
  id?: string;
  name: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  postcode: string;
  country: string;
  companyName: string;
  companyNumber: string;
  storeType: number;
  bankDetails: BankDetail[];
  openingHours: OpeningHour[];
  documents?: StoreDocument[] | Record<string, StoreDocument>;

}
