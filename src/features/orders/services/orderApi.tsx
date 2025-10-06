import { baseApi } from "../../../services/baseApi"
import type { Order, OrderListResponse } from "../helpers/ordersHelpers"

export const ordersApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        getOrders: builder.query<
            OrderListResponse,
            { page?: number; perPage?: number; query?: string;[key: string]: any }
        >({
            query: (args) => {
                const { page = 1, perPage = 10, query = "", ...filters } = args ?? {}
                console.log("🔍 Orders API Params:", { page, perPage, query, ...filters });
                return {
                    url: "/orders",
                    params: {
                        page,
                        perPage,
                        query,
                        ...filters
                    }
                }
            },
            transformResponse: (resp: any): OrderListResponse => {


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
                result
                    ? [
                        ...result.data.map((o) => ({
                            type: "Orders" as const,
                            id: o.id,
                        })),
                        { type: "Orders" as const, id: "LIST" },
                    ]
                    : [{ type: "Orders" as const, id: "LIST" }],
        }),

        getOrderById: builder.query<Order, string>({
            query: (id) => `/orders/${id}`,
            providesTags: (_result, _error, id) => [{ type: "Orders", id }],
        }),
    }),
})

export const { useGetOrdersQuery, useGetOrderByIdQuery } = ordersApi