import { baseApi } from "./baseApi";
import type {
  CreateDocumentDto,
  UpdateDocumentDto,
} from "../types/document.types";

export const documentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDocuments: builder.query<Document[], any>({
      query: (params) => ({
        url: "/documents",
        method: "GET",
        params,
      }),
      providesTags: ["Documents"],
    }),

    getDocumentById: builder.query<Document, string>({
      query: (id) => `/documents/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Documents", id }],
    }),

    createDocument: builder.mutation<Document, CreateDocumentDto>({
      query: (body) => ({
        url: "/documents",
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

    getPresignedUrl: builder.mutation<
      { url: string; key: string; method: string },
      {
        fileName: string;
        fileType: string;
        ownerType: "user" | "store" | "warehouse" | "device";
        ownerId: string;
      }
    >({
      query: (body) => ({
        url: "/documents/presigned-url",
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
  useGetPresignedUrlMutation,
} = documentApi;
