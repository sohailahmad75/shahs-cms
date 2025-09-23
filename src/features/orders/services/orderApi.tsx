// services/orderApi.ts
import { baseApi } from "../../../services/baseApi"
import type { Order, OrderListResponse } from "../helpers/ordersHelpers"

export const ordersApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        getOrders: builder.query<
            OrderListResponse,
            { page?: number; perPage?: number; query?: string }
        >({
            query: (args) => {
                const { page = 1, perPage = 10, query = "", ...filters } = args ?? {}
                return { url: "/orders", params: { page, perPage, query, ...filters } }
            },
            transformResponse: (resp: any): OrderListResponse => {
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
                    data: resp.data || resp.items || [],
                    meta: resp.meta || {
                        total: (resp.data || resp.items || []).length,
                        page: 1,
                        perPage: 10,
                        totalPages: 1,
                    }
                }
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