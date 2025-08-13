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
