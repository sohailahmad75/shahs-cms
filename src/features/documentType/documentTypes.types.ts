export interface DocumentType {
  id: string;
  documentName: string;
  description: string;
  created: string;
}

export interface CreateDocumnetDto {
  documentName: string;
  documentDescription?: string;
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
