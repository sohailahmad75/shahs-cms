import { baseApi } from "../../services/baseApi";

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    connectBank: builder.mutation({
      query: (data) => ({
        url: "/bank/connect",
        method: "POST",
        body: data,
      }),
    }),
    finalizeBank: builder.mutation({
      query: (data) => ({
        url: "/bank/finalize",
        method: "POST",
        body: data,
      }),
    }),
    getBanks: builder.query({
      query: () => ({
        url: "/bank",
        method: "GET",
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useConnectBankMutation,
  useGetBanksQuery,
  useFinalizeBankMutation,
} = dashboardApi;
