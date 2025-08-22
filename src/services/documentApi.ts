import { baseApi } from "./baseApi";
import type {
  CreateDocumentDto,
  UpdateDocumentDto,
} from "../types/document.types";

export const documentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // getDocuments: builder.query<Document[], any>({
    //   query: (params) => ({
    //     url: `/documents/store/${params.storeId}`,
    //     method: "GET",
    //   }),
    //   providesTags: ["Documents"],
    // }),

    getDocuments: builder.query<Document[], any>({
      query: (params) => ({
        url: `/documents/store/${params.storeId}`,
        method: "GET",
      }),
      transformResponse: (response: { data: Document[]; meta: any }) => response.data,
      providesTags: ["Documents"],
    }),


    getDocumentById: builder.query<Document, string>({
      query: (id) => `/documents/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Documents", id }],
    }),

    postDocument: builder.mutation<Document, CreateDocumentDto>({
      query: (body) => ({
        url: "/documents/store",
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
  usePostDocumentMutation,
  useUpdateDocumentMutation,
  useDeleteDocumentMutation,
  useGetPresignedStoreDocUrlMutation,
} = documentApi;
