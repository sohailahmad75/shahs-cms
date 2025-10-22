import type { Product, PaginatedResponse } from "../product.types";
import { baseApi } from "../../../../services/baseApi";

type SortDir = "ASC" | "DESC";

export interface GetProductsArgs {
  page?: number;
  perPage?: number;
  query?: string;
  categoryId?: string;
  supplierId?: string;
  isActive?: boolean;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
  sortDir?: SortDir;
  createdAt?: string;
  stockStatus?: "LOW" | "OUT";
  [key: string]: any; 
}

export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<
      PaginatedResponse<Product>,
      GetProductsArgs | void
    >({
      query: (args) => {
        const {
          page = 1,
          perPage = 10,
          query = "",
          ...filters
        } = args || {};

        console.log("🔍 Products API Params:", { page, perPage, query, ...filters });

        return {
          url: "/inventory/products",
          method: "GET",
          params: {
            page,
            perPage,
            query,
            ...filters
          }
        };
      },
      
      transformResponse: (resp: any): PaginatedResponse<Product> => {
      
        if (resp && typeof resp === 'object' && resp.data && resp.meta) {
          return {
            data: resp.data,
            meta: resp.meta
          };
        }

        if (resp && typeof resp === 'object' && resp.items) {
          const total = resp.total || resp.items.length;
          const page = resp.page || 1;
          const perPage = resp.perPage || resp.per_page || 10;
          const totalPages = resp.totalPages || resp.total_pages || Math.ceil(total / perPage);

          return {
            data: resp.items,
            meta: {
              total,
              page,
              perPage,
              totalPages,
            }
          };
        }

        if (Array.isArray(resp)) {
          return {
            data: resp,
            meta: {
              total: resp.length,
              page: 1,
              perPage: resp.length,
              totalPages: 1,
            },
          }
        }

        return {
          data: [],
          meta: {
            total: 0,
            page: 1,
            perPage: 10,
            totalPages: 0,
          }
        };
      },
      providesTags: (result) =>
        result?.data
          ? [
            ...result.data.map(({ id }) => ({
              type: "Product" as const,
              id,
            })),
            { type: "Products" as const, id: "LIST" },
          ]
          : [{ type: "Products" as const, id: "LIST" }],
    }),

    createProduct: builder.mutation<Product, Partial<Product>>({
      query: (body) => ({ url: "/inventory/products", method: "POST", body }),
      invalidatesTags: [{ type: "Products", id: "LIST" }],
    }),

    updateOneProducts: builder.mutation<
      Product,
      { id: string; data: Partial<Product> }
    >({
      query: ({ id, data }) => ({
        url: `/inventory/products/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ({ id }) => [
        { type: "Product", id },
        { type: "Products", id: "LIST" },
      ],
    }),

    deleteProduct: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({ url: `/products/${id}`, method: "DELETE" }),
      invalidatesTags: [{ type: "Products", id: "LIST" }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetProductsQuery,
  useCreateProductMutation,
  useUpdateOneProductsMutation,
  useDeleteProductMutation,
} = productApi;
