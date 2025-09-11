import { baseApi } from "../../../services/baseApi";
import type { UpdateUsersDto, UsersTypeListResponse, CreateUsersDto, Users } from "../users.types";

export const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getNewUsers: builder.query<
      UsersTypeListResponse,
      { page?: number; perPage?: number; query?: string;[key: string]: any } | void
    >({
      query: (args) => {
        const { page = 1, perPage = 10, query = "", ...filters } =
          (args || {}) as Record<string, any>;

        console.log("🔍 Users API Params:", { page, perPage, query, ...filters });

        return {
          url: "/users",
          params: {
            page,
            perPage,
            query,
            ...filters,
          },
        };
      },
      providesTags: (result) =>
        result
          ? [
            ...result.data.map((user) => ({
              type: "Users" as const,
              id: user.id!,
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


    getUsersById: builder.query<Users, string>({
      query: (id) => `/users/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Users", id }],
    }),

    getAll: builder.mutation<
      { url: string; key: string; method: string },
      { fileName: string; fileType: string }
    >({
      query: (body) => ({
        url: "/users/presigned-url",
        method: "POST",
        body,
      }),

    }),

  }),
});

export const {
  useGetNewUsersQuery,
  useCreateUsersMutation,
  useUpdateUsersMutation,
  useDeleteUsersMutation,
  useGetUsersByIdQuery,
  useGetAllMutation
} = usersApi;
