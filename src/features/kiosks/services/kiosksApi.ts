import { baseApi } from "../../../services/baseApi";
import type { Kiosk, KioskListResponse } from "../kiosks.types";
import type { CreateKioskDto, UpdateKioskDto } from "../kiosks.types";

export const kiosksApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    getKiosks: builder.query<
      KioskListResponse,
      { page?: number; perPage?: number; query?: string, }
    >({
      query: (args) => {
        const { page = 1, perPage = 10, query = "", ...filters } = args ?? {};
        return { url: "/kiosks", params: { page, perPage, query, ...filters } };
      },
      transformResponse: (resp: any) => {
        if (Array.isArray(resp)) {
          return {
            data: resp,
            meta: {
              total: resp.length,
              page: 1,
              perPage: resp.length,
              totalPages: 1,
            },
          } as KioskListResponse;
        }
        return resp;
      },
      providesTags: (result) =>
        result
          ? [
            ...result.data.map((k) => ({
              type: "Kiosks" as const,
              id: k.id,
            })),
            { type: "Kiosks" as const, id: "LIST" },
          ]
          : [{ type: "Kiosks" as const, id: "LIST" }],
    }),

    createKiosk: builder.mutation<Kiosk, CreateKioskDto>({
      query: (body) => ({
        url: "/kiosks",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Kiosks" }],
    }),

    updateKiosk: builder.mutation<Kiosk, { id: string; data: UpdateKioskDto }>({
      query: ({ id, data }) => ({
        url: `/kiosks/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Kiosks", id },
        { type: "Kiosks" },
      ],
    }),

    deleteKiosk: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/kiosks/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Kiosks", id },
        { type: "Kiosks" },
      ],
    }),

    getKioskById: builder.query<Kiosk, string>({
      query: (id) => `/kiosks/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Kiosks", id }],
    }),
  }),
});

export const {
  useGetKiosksQuery,
  useCreateKioskMutation,
  useUpdateKioskMutation,
  useDeleteKioskMutation,
  useGetKioskByIdQuery,
} = kiosksApi;
