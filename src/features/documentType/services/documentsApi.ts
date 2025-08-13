import { baseApi } from "../../../services/baseApi";
import type { DocumentType, CreateDocumnetDto, UpdateDocumentDto } from "../documentTypes.types";

export const documentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDocuments: builder.query<DocumentType[], void>({
      query: () => "/documents",
      providesTags: (result) =>
        result
          ? [
              ...result.map((doc) => ({
                type: "Documents" as const,
                id: doc.id,
              })),
              { type: "Documents" },
            ]
          : [{ type: "Documents" }],
    }),

    // Create Document
    createDocument: builder.mutation<DocumentType, CreateDocumnetDto>({
      query: (body) => ({
        url: "/documents",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Documents" }],
    }),

    // Update Document
    updateDocument: builder.mutation<
      DocumentType,
      { id: string; data: UpdateDocumentDto }
    >({
      query: ({ id, data }) => ({
        url: `/documents/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Documents", id },
        { type: "Documents" },
      ],
    }),

    // Delete Document
    deleteDocument: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/documents/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Documents", id },
        { type: "Documents" },
      ],
    }),

    // Get Document by ID
    getDocumentById: builder.query<DocumentType, string>({
      query: (id) => `/documents/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Documents", id }],
    }),
  }),
});

export const {
  useGetDocumentsQuery,
  useCreateDocumentMutation,
  useUpdateDocumentMutation,
  useDeleteDocumentMutation,
  useGetDocumentByIdQuery,
} = documentsApi;
