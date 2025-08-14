export interface DocumentType {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}

export interface CreateDocumnetDto {
  name: string;
  description?: string;
}
export type UpdateDocumentDto = CreateDocumnetDto;
