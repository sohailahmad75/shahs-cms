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
  status?: string;
  createdAtFrom?: string;
  createdAtTo?: string;
  updatedAtFrom?: string;
  updatedAtTo?: string;
  [key: string]: any; 
}

export const productCategoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProductCategories: builder.query<
      PaginatedResponse<ProductCategory>,
      GetCategoriesArgs | void
    >({
      query: (args) => {
        const {
          page = 1,
          perPage = 10,
          query,
          sort = "createdAt",
          sortDir = "DESC",
          status,
          createdAtFrom,
          createdAtTo,
          updatedAtFrom,
          updatedAtTo,
          ...otherFilters
        } = args || {};

        console.log("🔍 Product Categories API Params:", {
          page, perPage, query, sort, sortDir,
          status, createdAtFrom, createdAtTo,
          updatedAtFrom, updatedAtTo, ...otherFilters
        });

        const params: Record<string, any> = {
          page,
          perPage,
        };

        if (query) params.query = query;
        if (sort) params.sort = sort;
        if (sortDir) params.sortDir = sortDir;

       
        if (status) params.status = status;
        if (createdAtFrom) params.createdAtFrom = createdAtFrom;
        if (createdAtTo) params.createdAtTo = createdAtTo;
        if (updatedAtFrom) params.updatedAtFrom = updatedAtFrom;
        if (updatedAtTo) params.updatedAtTo = updatedAtTo;

   
        Object.keys(otherFilters).forEach(key => {
          if (otherFilters[key] !== undefined && otherFilters[key] !== null && otherFilters[key] !== '') {
            params[key] = otherFilters[key];
          }
        });

        return {
          url: `/inventory/categories`,
          method: "GET",
          params
        };
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