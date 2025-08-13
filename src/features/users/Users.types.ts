export interface UsersType {
  id: string;
  name: string;
  userType: 'staff' | 'store_owner';
  fileS3Key?: string;
  fileType?: string;
  expiresAt?: string;
  remindBeforeDays?: number;
  stores?: string[];
  created: string;
}

export interface CreateUsersDto {
  name: string;
  userType: 'staff' | 'store_owner';
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