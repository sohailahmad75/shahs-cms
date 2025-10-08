import { fetchBaseQuery, type BaseQueryFn } from "@reduxjs/toolkit/query/react";
import type { FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { toast } from "react-toastify";
import { logout } from "../features/auth/authSlice"; // 👈 import logout action

type ApiError = {
  status: number;
  data: {
    message?: string | string[];
    [key: string]: unknown;
  };
};

type CustomExtraOptions = {
  skipToast?: boolean;
};

const rawBaseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_BASE_URL || "http://localhost:3001",
  credentials: "include",
  prepareHeaders: (headers) => {
    const token = localStorage.getItem("token");
    if (token) headers.set("Authorization", `Bearer ${token}`);
    return headers;
  },
});

export const baseQueryWithErrorHandling: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError,
  CustomExtraOptions
> = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);

  //   if (result.error?.status === 401) {
  //   localStorage.removeItem("token");
  //   toast.error("Session expired. Please login again.");
  //   window.location.href = "/login";
  //   return result;
  // }

  if (result.error && !extraOptions?.skipToast) {
    const err = result.error as ApiError;

    // 👇 handle 401 globally
    if (err.status === 401) {
      api.dispatch(logout());
      return result; // no need to toast for 401
    }

    // 👇 show toast for other errors
    if (!extraOptions?.skipToast) {
      const message = err?.data?.message;
      if (Array.isArray(message)) {
        message.forEach((msg: string) => toast.error(msg));
      } else {
        toast.error(message || "Something went wrong");
      }
    }
  }

  return result;
};
