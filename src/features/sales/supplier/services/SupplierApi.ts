import type {
  Supplier,
  PaginatedResponse,
} from "../Supplier.types";
import { baseApi } from "../../../../services/baseApi";

type SortDir = "ASC" | "DESC";
export interface GetCategoriesArgs {
  page?: number;
  perPage?: number;
  query?: string;
  sort?: "name" | "createdAt" | "updatedAt";
  sortDir?: SortDir;
}

export const SupplierApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getNewAllSupplier: builder.query<
      PaginatedResponse<Supplier>,
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
        return { url: `/suppliers?${p.toString()}`, method: "GET" };
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

    postSupplier: builder.mutation<
      Supplier,
      Pick<Supplier, "name">
    >({
      query: (body) => ({ url: "/suppliers", method: "POST", body }),
      invalidatesTags: [{ type: "Supplier", id: "LIST" }],
    }),

    putSupplier: builder.mutation<
      Supplier,
      { id: string; data: Pick<Supplier, "name"> }
    >({
      query: ({ id, data }) => ({
        url: `/suppliers/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_r, _e, { id }) => [
        { type: "Supplier", id },
        { type: "Supplier", id: "LIST" },
      ],
    }),

    deleteSupplier: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({ url: `/suppliers/${id}`, method: "DELETE" }),
      invalidatesTags: [{ type: "Supplier", id: "LIST" }],
    }),
  }),
});

export const {
  useGetNewAllSupplierQuery,
  usePostSupplierMutation,
  usePutSupplierMutation,
  useDeleteSupplierMutation,
} = SupplierApi;
