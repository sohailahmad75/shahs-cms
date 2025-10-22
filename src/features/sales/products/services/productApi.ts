import type { Product, PaginatedResponse } from "../product.types";
import { baseApi } from "../../../../services/baseApi";

type SortDir = "ASC" | "DESC";

export interface GetProductsArgs {
  page?: number;
  perPage?: number;
  query?: string;
  categoryId?: string;
  isActive?: boolean;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
  sortDir?: SortDir;
}

export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<
      PaginatedResponse<Product>,
      GetProductsArgs | void
    >({
      query: (args) => {
        const p = new URLSearchParams();
        const {
          page = 1,
          perPage = 10,
          query,
          categoryId,
          isActive,
          minPrice,
          maxPrice,
          sort,
          sortDir,
        } = args || {};
        p.set("page", String(page));
        p.set("perPage", String(perPage));
        if (query) p.set("query", query);
        if (categoryId) p.set("categoryId", categoryId);
        if (typeof isActive === "boolean") p.set("isActive", String(isActive));
        if (minPrice !== undefined) p.set("minPrice", String(minPrice));
        if (maxPrice !== undefined) p.set("maxPrice", String(maxPrice));
        if (sort) p.set("sort", sort);
        if (sortDir) p.set("sortDir", sortDir);
        return { url: `inventory/products?${p.toString()}`, method: "GET" };
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

    updateProducts: builder.mutation<
      Product,
      { id: string; data: Partial<Product> }
    >({
      query: ({ id, data }) => ({
        url: `/products/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (r, e, { id }) => [
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
  useUpdateProductsMutation,
  useDeleteProductMutation,
} = productApi;
