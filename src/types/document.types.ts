export type OwnerType = "user" | "store" | "warehouse" | "device";

export interface Document {
  id: string;
  name: string;
  fileS3Key: string;
  expiresAt?: string; // ISO string
  remindBeforeDays?: number;
  ownerType: OwnerType;
  ownerId: string;
  documentTypeId: string;

  // Optional metadata
  createdBy?: string;
  updatedBy?: string;
  createdAt?: string;
  updatedAt?: string;

  documentType?: {
    id: string;
    name: string;
    code: string;
    description?: string;
    defaultReminderDays?: number;
  };
}

export interface CreateDocumentDto {
  name: string;
  fileS3Key: string;
  expiresAt?: Date | string;
  remindBeforeDays?: number;
  ownerType: OwnerType;
  ownerId: string;
  documentTypeId: string;
}

export interface UpdateDocumentDto {
  name?: string;
  fileS3Key?: string;
  expiresAt?: Date | string;
  remindBeforeDays?: number;
  documentTypeId?: string;
}
