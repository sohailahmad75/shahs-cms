import { createSlice } from "@reduxjs/toolkit";

// Get initial values from localStorage
const admin = localStorage.getItem("admin");
const token = localStorage.getItem("token");

const initialState = {
  admin: admin ? JSON.parse(admin) : null,
  token: token || null,
  isAuthenticated: !!token,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAdmin(state, action) {
      state.admin = action.payload.admin;
      state.token = action.payload.token;
      state.isAuthenticated = true;

      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("admin", JSON.stringify(action.payload.admin));
    },
    logout(state) {
      state.admin = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.clear();
    },
  },
});

export const { setAdmin, logout } = authSlice.actions;
export default authSlice.reducer;
