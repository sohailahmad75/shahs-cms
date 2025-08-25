import { baseApi } from "../../../services/baseApi";
import type { UpdateUsersDto, UsersTypeListResponse, CreateUsersDto } from "../users.types";

export const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<
      UsersTypeListResponse,
      { page?: number; perPage?: number; search?: string } | void
    >({
      query: (args) => {
        const params = (args || {}) as { page?: number; perPage?: number; search?: string };
        const { page = 1, perPage = 10, search = "" } = params;
        return { url: "/users", params: { page, perPage, search } };
      },
      providesTags: (result) =>
        result
          ? [
            ...result.data.map((doc) => ({
              type: "Users" as const,
              id: doc.id!,
            })),
            { type: "Users" as const, id: "LIST" },
          ]
          : [{ type: "Users" as const, id: "LIST" }],
    }),


    createUsers: builder.mutation<DocumentType, CreateUsersDto>({
      query: (body) => ({
        url: "/users",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Users" }],
    }),

    updateUsers: builder.mutation<
      DocumentType,
      { id: string; data: UpdateUsersDto }
    >({
      query: ({ id, data }) => ({
        url: `/users/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Users", id },
        { type: "Users" },
      ],
    }),
    deleteUsers: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Users", id },
        { type: "Users" },
      ],
    }),


    getUsersById: builder.query<DocumentType, string>({
      query: (id) => `/users/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Users", id }],
    }),

    getNewPresignedUrl: builder.mutation<
  { url: string; key: string; method: string },
  { fileName: string; fileType: string; documentId: string }
>({
  query: (body) => ({
    url: "/documents",
    method: "POST",
    body,
  }),
}),

  }),
});

export const {
  useGetUsersQuery,
  useCreateUsersMutation,
  useUpdateUsersMutation,
  useDeleteUsersMutation,
  useGetUsersByIdQuery,
  useGetNewPresignedUrlMutation
} = usersApi;
