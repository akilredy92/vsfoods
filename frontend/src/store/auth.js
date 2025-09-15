import { create } from "zustand";
import { login as apiLogin, signup as apiSignup, me as apiMe } from "../api/client";

const useAuth = create((set) => ({
  user: null,
  token: localStorage.getItem("vsfoods_token") || "",
  loading: false,
  error: "",

  init: async () => {
    const token = localStorage.getItem("vsfoods_token");
    if (!token) return;
    try {
      const { user } = await apiMe();
      set({ user, token, error: "" });
    } catch {
      localStorage.removeItem("vsfoods_token");
      set({ user: null, token: "", error: "" });
    }
  },

  login: async (email, password) => {
    set({ loading: true, error: "" });
    try {
      const { token, user } = await apiLogin({ email, password });
      localStorage.setItem("vsfoods_token", token);
      set({ user, token, loading: false });
      return true;
    } catch (e) {
      set({ loading: false, error: "Invalid email or password" });
      return false;
    }
  },

  signup: async (name, email, password) => {
    set({ loading: true, error: "" });
    try {
      const { token, user } = await apiSignup({ name, email, password });
      localStorage.setItem("vsfoods_token", token);
      set({ user, token, loading: false });
      return true;
    } catch (e) {
      set({ loading: false, error: e?.response?.data?.error || "Signup failed" });
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem("vsfoods_token");
    set({ user: null, token: "" });
  }
}));

export default useAuth;
