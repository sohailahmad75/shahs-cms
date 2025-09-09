import type { Meta } from "../../types";

export interface DocumentType {
  isMandatory: any;
  id: string;
  name: string;
  description: string;
  createdAt: string;
}





export interface DocumentTypeListResponse {
  data: DocumentType[];
  meta: Meta;
}


export interface CreateDocumnetDto {
  staffKind: DocumentTypeStaffKind;
  role: DocumentTypeRole;
  isMandatory: boolean;
  name: string;
  description?: string;
}
export type UpdateDocumentDto = CreateDocumnetDto;

export type DocumentTypeRole = "owner" | "staff";
export type DocumentTypeStaffKind =
  | "full_time"
  | "student"
  | "sponsored"
  | "psw"
  | "asylum"
  | "other";
