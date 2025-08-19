import type { Meta } from "../../types";

export interface DocumentType {
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
  name: string;
  description?: string;
}
export type UpdateDocumentDto = CreateDocumnetDto;



