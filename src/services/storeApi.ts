import { baseApi } from "./baseApi";
import type { Store } from "../features/stores/types";
import type { CreateStoreDto, UpdateStoreDto } from "../features/stores/types";

export const storeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getStores: builder.query<Store[], void>({
      query: () => "/stores",
      providesTags: (result) =>
        result
          ? [
              ...result.map((store) => ({
                type: "Stores" as const,
                id: store.id,
              })),
              { type: "Stores" },
            ]
          : [{ type: "Stores" }],
    }),

    createStore: builder.mutation<Store, CreateStoreDto>({
      query: (body) => ({
        url: "/stores",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Stores" }],
    }),

    updateStore: builder.mutation<Store, { id: string; data: UpdateStoreDto }>({
      query: ({ id, data }) => ({
        url: `/stores/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Stores", id },
        { type: "Stores" },
      ],
    }),

    deleteStore: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/stores/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Stores", id },
        { type: "Stores" },
      ],
    }),
  }),
});

export const {
  useGetStoresQuery,
  useCreateStoreMutation,
  useUpdateStoreMutation,
  useDeleteStoreMutation,
} = storeApi;
