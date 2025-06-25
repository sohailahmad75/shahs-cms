import { useSelector } from "react-redux";
import type { RootState } from "../store";
import { useMemo } from "react";

export const selectCurrentUser = (state: RootState) => state.auth;
export const selectAccessToken = () => localStorage.getItem("token");
export const useUser = () => {
  const user = useSelector(selectCurrentUser);
  return useMemo(() => ({ user }), [user]);
};

export const useToken = () => {
  const token = selectAccessToken();
  return useMemo(() => ({ token }), [token]);
};
