export interface UsersType {
  id: string;
  name: string;
  userType: "staff" | "store_owner";
  fileS3Key?: string;
  fileType?: string;
  expiresAt?: string;
  remindBeforeDays?: number;
  stores?: string[];
  created: string;
}

export interface CreateUsersDto {
  name: string;
  userType: "staff" | "store_owner";
  fileS3Key?: string;
  fileType?: string;
  expiresAt?: string;
  remindBeforeDays?: number;
  stores?: string[];
  documentDescription?: string;
}

export type UpdateUsersDto = CreateUsersDto & {
  id: string;
};

export type UserInfoTypes = {
  firstName: string;
  surName: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  postcode: string;
  dob: string | Date | null;
  cashInRate: number | string;
  niRate: number | string;
  shareCode: string;
  type: "staff" | "owner" | "";
  niNumber: string;
  bankDetails: Array<{
    bankName: string;
    accountNumber: string;
    sortCode: string;
  }>;
  openingHours: Array<{
    day: string;
    open: string;
    close: string;
    closed: boolean;
  }>;
  sameAllDays: boolean;
  fileS3Key: string;
  fileType: string;
  expiresAt: string | Date | null;
  remindBeforeDays: number | string;
};
