import { baseApi } from "../../../services/baseApi";
import type {
  Store,
  StoreListResponse,
  CreateStoreDto,
  UpdateStoreDto,
} from "../store.types";

export const storeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getStores: builder.query<
      StoreListResponse,
      { page?: number; perPage?: number; query?: string;[key: string]: any } | void
    >({
      query: (args) => {
        const { page = 1, perPage = 10, query = "", ...filters } =
          (args || {}) as Record<string, any>

        console.log("🔍 API Params:", { page, perPage, query, ...filters })

        return {
          url: "/stores",
          params: {
            page,
            perPage,
            query,
            ...filters,
          },
        }
      },
      providesTags: (result) =>
        result
          ? [
            ...result.data.map((s) => ({
              type: "Stores" as const,
              id: s.id,
            })),
            { type: "Stores" as const, id: "LIST" },
          ]
          : [{ type: "Stores" as const, id: "LIST" }],
    }),

    createStore: builder.mutation<Store, CreateStoreDto>({
      query: (body) => ({
        url: "/stores",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Stores" }],
    }),

    updateStores: builder.mutation<Store, { id: string; data: UpdateStoreDto }>({
      query: ({ id, data }) => ({
        url: `/stores/${id}`,
        method: "PUT",
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
  useUpdateStoresMutation,
  useDeleteStoreMutation,
  useGetStoreByIdQuery,
  useUpdateOpeningHoursMutation,
} = storeApi;
