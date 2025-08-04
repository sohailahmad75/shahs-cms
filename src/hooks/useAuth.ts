import { useSelector } from "react-redux";
import type { RootState } from "../store";
import { useMemo } from "react";

export const selectCurrentAdmin = (state: RootState) => state.auth;
export const selectAccessToken = () => localStorage.getItem("token");
export const useAdmin = () => {
  const admin = useSelector(selectCurrentAdmin);
  return useMemo(() => ({ admin }), [admin]);
};

export const useToken = () => {
  const token = selectAccessToken();
  return useMemo(() => ({ token }), [token]);
};
