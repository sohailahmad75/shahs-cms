import { baseApi } from "../../../services/baseApi";
import type { DocumentType, CreateDocumnetDto, UpdateDocumentDto,DocumentTypeListResponse } from "../documentTypes.types";

export const documentsTypeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDocumentsType: builder.query<
      DocumentTypeListResponse,
      { page?: number; perPage?: number; search?: string } | void
    >({
      query: (args) => {
        const { page = 1, perPage = 10, search = "" } = args ?? {};
        return { url: "/document-type", params: { page, perPage, search } };
      },
      providesTags: (result) =>
        result
          ? [
            ...result.data.map((doc: { id: any; }) => ({
              type: "DocumentsType" as const,
              id: doc.id,
            })),
            { type: "DocumentsType" as const, id: "LIST" },
          ]
          : [{ type: "DocumentsType" as const, id: "LIST" }],
    }),

    createDocumentsType: builder.mutation<DocumentType, CreateDocumnetDto>({
      query: (body) => ({
        url: "/document-type",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "DocumentsType" }],
    }),


    updateDocumentsType: builder.mutation<
      DocumentType,
      { id: string; data: UpdateDocumentDto }
    >({
      query: ({ id, data }) => ({
        url: `/document-type/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "DocumentsType", id },
        { type: "DocumentsType" },
      ],
    }),

    deleteDocumentsType: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/docu/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "DocumentsType", id },
        { type: "DocumentsType" },
      ],
    }),

    getDocumentsTypeById: builder.query<DocumentType, string>({
      query: (id) => `/document-type/${id}`,
      providesTags: (_result, _error, id) => [{ type: "DocumentsType", id }],
    }),
  }),
});

export const {
  useGetDocumentsTypeQuery,
  useCreateDocumentsTypeMutation,
  useUpdateDocumentsTypeMutation,
  useDeleteDocumentsTypeMutation,
  useGetDocumentsTypeByIdQuery,
} = documentsTypeApi;
