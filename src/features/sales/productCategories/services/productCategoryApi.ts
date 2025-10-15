import type {
  ProductCategory,
  PaginatedResponse,
} from "../productCategory.types";
import { baseApi } from "../../../../services/baseApi";

type SortDir = "ASC" | "DESC";
export interface GetCategoriesArgs {
  page?: number;
  perPage?: number;
  query?: string;
  sort?: "name" | "createdAt" | "updatedAt";
  sortDir?: SortDir;
}

export const productCategoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProductCategories: builder.query<
      PaginatedResponse<ProductCategory>,
      GetCategoriesArgs | void
    >({
      query: (args) => {
        const p = new URLSearchParams();
        const {
          page = 1,
          perPage = 10,
          query,
          sort = "createdAt",
          sortDir = "DESC",
        } = args || {};
        p.set("page", String(page));
        p.set("perPage", String(perPage));
        if (query) p.set("query", query);
        if (sort) p.set("sort", sort);
        if (sortDir) p.set("sortDir", sortDir);
        return { url: `/inventory/categories?${p.toString()}`, method: "GET" };
      },
      providesTags: (result) =>
        result?.data
          ? [
            ...result.data.map(({ id }) => ({
              type: "ProductCategory" as const,
              id,
            })),
            { type: "ProductCategory" as const, id: "LIST" },
          ]
          : [{ type: "ProductCategory" as const, id: "LIST" }],
    }),

    createProductCategory: builder.mutation<
      ProductCategory,
      Pick<ProductCategory, "name">
    >({
      query: (body) => ({ url: "/inventory/categories", method: "POST", body }),
      invalidatesTags: [{ type: "ProductCategory", id: "LIST" }],
    }),

    updateCategory: builder.mutation<
      ProductCategory,
      { id: string; data: Pick<ProductCategory, "name"> }
    >({
      query: ({ id, data }) => ({
        url: `/inventory/categories/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_r, _e, { id }) => [
        { type: "ProductCategory", id },
        { type: "ProductCategory", id: "LIST" },
      ],
    }),

    deleteProductCategory: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({ url: `/inventory/categories/${id}`, method: "DELETE" }),
      invalidatesTags: [{ type: "ProductCategory", id: "LIST" }],
    }),
  }),
});

export const {
  useGetProductCategoriesQuery,
  useCreateProductCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteProductCategoryMutation,
} = productCategoryApi;
