import { baseApi } from "../../../services/baseApi";
import type { Kiosk } from "../kiosks.types";
import type { CreateKioskDto, UpdateKioskDto } from "../kiosks.types";

export const kiosksApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getKiosks: builder.query<Kiosk[], void>({
      query: () => "/Kiosks",
      providesTags: (result) =>
        result
          ? [
              ...result.map((kiosk) => ({
                type: "Kiosks" as const,
                id: kiosk.id,
              })),
              { type: "Kiosks" },
            ]
          : [{ type: "Kiosks" }],
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
