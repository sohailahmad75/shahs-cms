import type { Supplier, PaginatedResponse } from "../Supplier.types";
import { baseApi } from "../../../../services/baseApi";

type SortDir = "ASC" | "DESC";
export interface GetSuppliersArgs {
  page?: number;
  perPage?: number;
  query?: string;
  sort?: "name" | "createdAt" | "updatedAt";
  sortDir?: SortDir;
  [key: string]: any;
}

interface ApiSupplierResponse {
  suppliers: Supplier[];
  pagination: {
    currentPage: number;
    perPage: number;
    totalCount: number;
    totalPages: number;
  };
}

export const SupplierApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllSupplier: builder.query<
      PaginatedResponse<Supplier>,
      GetSuppliersArgs | void
    >({
      query: (args) => {
        const {
          page = 1,
          perPage = 10,
          query = "",
          sort = "createdAt",
          sortDir = "DESC",
          ...filters
        } = args || {};

        console.log("🔍 Supplier API Filters:", filters);

        const p = new URLSearchParams();
        p.set("page", String(page));
        p.set("perPage", String(perPage));
        if (query) p.set("query", query);
        if (sort) p.set("sort", sort);
        if (sortDir) p.set("sortDir", sortDir);


        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            p.set(key, String(value));
          }
        });

        return {
          url: `/suppliers?${p.toString()}`,
          method: "GET"
        };
      },
      transformResponse: (response: ApiSupplierResponse): PaginatedResponse<Supplier> => {
        return {
          data: response.suppliers,
          meta: {
            total: response.pagination.totalCount,
            page: response.pagination.currentPage,
            perPage: response.pagination.perPage,
            totalPages: response.pagination.totalPages,
          },
        };
      },
      providesTags: (result) =>
        result?.data
          ? [
            ...result.data.map(({ id }) => ({
              type: "Supplier" as const,
              id,
            })),
            { type: "Supplier" as const, id: "LIST" },
          ]
          : [{ type: "Supplier" as const, id: "LIST" }],
    }),

    createOneSupplier: builder.mutation<Supplier, Partial<Supplier>>({
      query: (data) => ({
        url: "/suppliers",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Supplier", id: "LIST" }],
    }),

    updateOneSupplier: builder.mutation<Supplier, { id: string; data: Partial<Supplier> }>({
      query: ({ id, data }) => ({
        url: `/suppliers/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ({ id }) => [{ type: "Supplier", id }],
    }),

    deleteOneSupplier: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({ url: `/suppliers/${id}`, method: "DELETE" }),
      invalidatesTags: [{ type: "Supplier", id: "LIST" }],
    }),

    getOneSupplier: builder.query<Supplier, string>({
      query: (id) => `/suppliers/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Supplier", id }],
    }),
  }),
});

export const {
  useGetAllSupplierQuery,
  useCreateOneSupplierMutation,
  useUpdateOneSupplierMutation,
  useDeleteOneSupplierMutation,
  useGetOneSupplierQuery,
} = SupplierApi;