import type { Meta } from "../../types";

export type UserType = "owner" | "staff";

export enum UserRole {
  OWNER = 1,
  STAFF = 3,
}

export type OpeningHour = {
  day: string;
  open: string;
  close: string;
  closed: boolean;
};

export type BankDetail = {
  userId?: string;
  accountNumber?: string;
  sortCode?: string;
  bankName?: string;
  accountHolderName?: string;
  iban?: string;
  swiftCode?: string;
};

export type FileType = "passport" | "fsa_cert" | "license" | "all" | "";

export type DocumentInfo = {
  fileS3Key?: string | null;
  fileType?: FileType;
  expiresAt?: any;
  remindBeforeDays?: number | null;
};

export type UserInfoTypes = {
  availabilityHours: any[];
  documents: any;
  role: UserRole;
  dateOfBirth: string;
  id?: string;
  type: UserType;
  firstName: string;
  surName: string;
  email: string;
  phone: number;
  street: string;
  city: string;
  postcode: string;
  cashInRate?: number | null;
  niRate?: number | null;
  niNumber?: string | null;
  shareCode?: string | null;

  bankDetails?: BankDetail[];


  openingHours: OpeningHour[];
  sameAllDays?: boolean;


  fileS3Key?: string | null;
  fileType?: string;
  expiresAt?: any;
  remindBeforeDays?: number | null;
};

export type UsersType = UserInfoTypes;


export type CreateUsersDto = {
  basicInfo: {
    firstName: string;
    surName: string;
    email: string;
    phone: number;
    street: string;
    city: string;
    postCode: string;
    dateOfBirth: string;
    cashInRate?: number | null;
    NiRate?: number | null;
    shareCode?: string | null;
    role: UserRole;
  };
};

export type UpdateUsersDto = {
  basicInfo?: {
    firstName?: string;
    surName?: string;
    email?: string;
    phone?: number;
    street?: string;
    city?: string;
    postCode?: string;
    dateOfBirth?: string;
    cashInRate?: number | null;
    NiRate?: number | null;
    shareCode?: string | null;
    role?: UserRole;
  };
  userBankDetails?: Array<Required<BankDetail>>;
  userAvailability?: Array<{
    day: string;
    open?: string | null;
    close?: string | null;
    closed?: boolean;
  }>;
  userDocuments?: UserDocument[];
};


export const userStepFieldKeys = {
  basic: [
    "firstName",
    "surName",
    "email",
    "phone",
    "street",
    "city",
    "postcode",
    "dateOfBirth",
    "cashInRate",
    "niRate",
    "niNumber",
    "shareCode",
    "password",
    "type",
  ],
  account: [
    "bankDetails",
  ],
  availability: [
    "openingHours",
    "sameAllDays",
  ],
  documents: [
    "fileS3Key",
    "fileType",
    "expiresAt",
    "remindBeforeDays",
  ],
} as const;



export interface UsersTypeListResponse {
  data: UsersType[];
  meta: Meta;
}


export type UserDocument = {
  documentType: string;
  fileType: string;
  fileS3Key: string | null;
  name?: string | null;
  expiresAt?: string | null;
  remindBeforeDays?: number | null;
};
