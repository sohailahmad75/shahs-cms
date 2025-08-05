import { baseApi } from "./baseApi";
import type {
  CreateDocumentDto,
  UpdateDocumentDto,
} from "../types/document.types";

export const documentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDocuments: builder.query<Document[], any>({
      query: (params) => ({
        url: `/documents/store-documents/${params.storeId}`,
        method: "GET",
      }),
      providesTags: ["Documents"],
    }),

    getDocumentById: builder.query<Document, string>({
      query: (id) => `/documents/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Documents", id }],
    }),

    createDocument: builder.mutation<Document, CreateDocumentDto>({
      query: (body) => ({
        url: "/documents/store-documents",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Documents"],
    }),

    updateDocument: builder.mutation<
      Document,
      { id: string; data: UpdateDocumentDto }
    >({
      query: ({ id, data }) => ({
        url: `/documents/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        "Documents",
        { type: "Documents", id },
      ],
    }),

    deleteDocument: builder.mutation<void, string>({
      query: (id) => ({
        url: `/documents/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Documents"],
    }),

    getPresignedStoreDocUrl: builder.mutation<
      { url: string; key: string; method: string },
      {
        fileName: string;
        fileType: string;
        storeId: string;
      }
    >({
      query: (body) => ({
        url: "/stores/presigned-url",
        method: "PUT",
        body,
      }),
    }),
  }),
});

export const {
  useGetDocumentsQuery,
  useGetDocumentByIdQuery,
  useCreateDocumentMutation,
  useUpdateDocumentMutation,
  useDeleteDocumentMutation,
  useGetPresignedStoreDocUrlMutation,
} = documentApi;
