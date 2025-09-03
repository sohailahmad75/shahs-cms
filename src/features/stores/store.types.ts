// import type { Meta } from "../../types";

// export interface BankDetail {
//   id: string;
//   ownerId: string;
//   ownerType: number;
//   accountNumber: string;
//   sortCode: string;
//   bankName: string;
//   accountHolderName?: string | null;
//   iban?: string | null;
//   swiftCode?: string | null;
//   storeId?: string;
//   createdAt: string;
//   updatedAt: string;
// }
// export interface FsaRating {
//   id: number;
//   name: string;
//   rating: string;
//   ratingDate: string;
//   address: string;
//   authority: string;
//   status: string;
// }
// export interface OpeningHour {
//   day: string;
//   open: string | null;
//   close: string | null;
//   closed: boolean;
// }

// export interface Store {
//   id: string;
//   name: string;
//   email: string;
//   phone: string;
//   street: string;
//   city: string;
//   postcode: string;
//   country: string;
//   uberStoreId?: string;
//   deliverooStoreId?: string;
//   justEatStoreId?: string;
//   vatNumber?: string;
//   googlePlaceId?: string;
//   fsaId?: string;
//   fsa?: FsaRating;
//   companyName: string;
//   companyNumber: string;
//   storeType: number;
//   bankDetails: BankDetail[];
//   openingHours: OpeningHour[];
// }
// export interface CreateStoreDto {
//   name: string;
//   email: string;
//   phone: string;
//   street: string;
//   city: string;
//   postcode: string;
//   country: string;
//   uberStoreId?: string;
//   deliverooStoreId?: string;
//   justEatStoreId?: string;
//   vatNumber?: string;
//   googlePlaceId?: string;
//   fsaId?: string;
//   companyName: string;
//   companyNumber: string;
//   storeType: number;
//   bankDetails: {
//     bankName: string;
//     accountNumber: string;
//     sortCode: string;
//   }[];
//   lat?: string;
//   lon?: string;
// }

// export interface UpdateStoreDto extends Partial<CreateStoreDto> {
//   id: string;
// }

// export interface StoreListResponse {
//   data: Store[];
//   meta: Meta;
// }



import type { Meta } from "../../types";

export interface BankDetail {
  id?: string;
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

export interface FsaRating {
  id: number;
  name: string;
  rating: string;
  ratingDate: string;
  address: string;
  authority: string;
  status: string;
}

export interface OpeningHour {
  day: string;
  open: string | null;
  close: string | null;
  closed: boolean;
}

export interface StoreDocument {
  documentTypeId: string;
  fileS3Key: string;
  fileType: string;
  name: string;
  expiresAt?: string;
  remindBeforeDays?: number;
  fileUrl?: string;
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
  uberStoreId?: string;
  deliverooStoreId?: string;
  justEatStoreId?: string;
  vatNumber?: string;
  googlePlaceId?: string;
  fsaId?: string;
  fsa?: FsaRating;
  companyName: string;
  companyNumber: string;
  storeType: number;
  bankDetails: BankDetail[];
  openingHours: OpeningHour[];
  documents?: StoreDocument[] | Record<string, StoreDocument>;
  lat?: string;
  lon?: string;
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
    accountHolderName?: string;
    iban?: string;
    swiftCode?: string;
  }[];
  lat?: string;
  lon?: string;
}


export interface UpdateStoreDto extends Partial<CreateStoreDto> {
  id?: string;
  openingHours?: OpeningHour[];
  documents?: StoreDocument[];
}

export interface StoreListResponse {
  data: Store[];
  meta: Meta;
}