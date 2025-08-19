import { baseApi } from "../../../services/baseApi";
import type { UpdateUsersDto, UsersType, CreateUsersDto } from "../Users.types";

export const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDocuments: builder.query<UsersType[], void>({
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

    createDocument: builder.mutation<DocumentType, CreateUsersDto>({
      query: (body) => ({
        url: "/documents",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Documents" }],
    }),

    updateDocument: builder.mutation<
      DocumentType,
      { id: string; data: UpdateUsersDto }
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
} = usersApi;
