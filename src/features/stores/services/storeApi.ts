import { baseApi } from "../../../services/baseApi";
import type {
  Store,
  StoreListResponse,
  CreateStoreDto,
  UpdateStoreDto,
} from "../store.types";

export const storeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getStores: builder.query<StoreListResponse, void>({
      query: () => "/stores",
      providesTags: (result) =>
        result
          ? [
              ...result.data.map((store) => ({
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

    getStoreById: builder.query<Store, string>({
      query: (id) => `/stores/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Stores", id }],
    }),

    updateOpeningHours: builder.mutation<
      Store,
      { id: string; data: UpdateStoreDto }
    >({
      query: ({ id, data }) => ({
        url: `/stores/${id}/opening-hours`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
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
  useGetStoreByIdQuery,
  useUpdateOpeningHoursMutation,
} = storeApi;
