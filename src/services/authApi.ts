import { baseApi } from "./baseApi";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: "/auth/login",
        method: "POST",
        body: data,
      }),
    }),
    register: builder.mutation({
      query: (data) => ({
        url: "/auth/register",
        method: "POST",
        body: data,
      }),
    }),
    verifyEmail: builder.query({
      query: (token: string) => ({
        url: `/auth/verify-email`,
        method: "GET",
        params: { token },
      }),
    }),
    resendVerification: builder.mutation({
      query: (data: { token: string }) => ({
        url: `/auth/resend-verification`,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useVerifyEmailQuery,
  useResendVerificationMutation,
} = authApi;
