import { baseApi } from "../../../services/baseApi";
import type { DocumentTypeListResponse } from "../../stores/store.types";
import type { DocumentType, CreateDocumnetDto, UpdateDocumentDto } from "../documentTypes.types";

export const documentsTypeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // getDocumentsType: builder.query<DocumentType[], void>({
    //   query: () => "/document-type",
    //   providesTags: (result) =>
    //     result
    //       ? [
    //           ...result.map((doc) => ({
    //             type: "DocumentsType" as const,
    //             id: doc.id,
    //           })),
    //           { type: "DocumentsType" },
    //         ]
    //       : [{ type: "DocumentsType" }],
    // }),

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
            ...result.data.map((doc) => ({
              type: "DocumentsType" as const,
              id: doc.id,
            })),
            { type: "DocumentsType" as const, id: "LIST" },
          ]
          : [{ type: "DocumentsType" as const, id: "LIST" }],
    }),

    // Create Document
    createDocumentsType: builder.mutation<DocumentType, CreateDocumnetDto>({
      query: (body) => ({
        url: "/document-type",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "DocumentsType" }],
    }),

    // Update Document
    updateDocumentsType: builder.mutation<
      DocumentType,
      { id: string; data: UpdateDocumentDto }
    >({
      query: ({ id, data }) => ({
        url: `/documents/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "DocumentsType", id },
        { type: "DocumentsType" },
      ],
    }),

    // Delete Document
    deleteDocumentsType: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/documents/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "DocumentsType", id },
        { type: "DocumentsType" },
      ],
    }),

    // Get Document by ID
    getDocumentsTypeById: builder.query<DocumentType, string>({
      query: (id) => `/documents/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Documents", id }],
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
