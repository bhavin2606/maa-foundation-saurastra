import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  token: string | null;
  admin: {
    id: string;
    username: string;
    email: string;
  } | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  token: typeof window !== "undefined" ? localStorage.getItem("token") : null,
  admin: typeof window !== "undefined" ? JSON.parse(localStorage.getItem("admin") || "null") : null,
  isAuthenticated: typeof window !== "undefined" ? !!localStorage.getItem("token") : false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ token: string; admin: AuthState["admin"] }>
    ) => {
      const { token, admin } = action.payload;
      state.token = token;
      state.admin = admin;
      state.isAuthenticated = true;
      if (typeof window !== "undefined") {
        localStorage.setItem("token", token);
        localStorage.setItem("admin", JSON.stringify(admin));
      }
    },
    logout: (state) => {
      state.token = null;
      state.admin = null;
      state.isAuthenticated = false;
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("admin");
      }
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
