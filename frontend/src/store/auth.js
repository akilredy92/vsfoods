import { create } from "zustand";

const LOCAL_KEY = "vsfoods_auth_v1";

const useAuth = create((set, get) => ({
  user: null,         // { id, firstName, lastName, email, phone, token? }

  init: () => {
    try {
      const raw = localStorage.getItem(LOCAL_KEY);
      if (raw) set({ user: JSON.parse(raw) });
    } catch {}
  },

  register: async (profile) => {
    // If you have a backend, call it here and set the result (user + token)
    // const res = await fetch("/api/auth/signup", { ... });
    // const data = await res.json();

    // For now, just store locally:
    const user = {
      id: crypto.randomUUID(),
      firstName: profile.firstName?.trim() || "Customer",
      lastName: profile.lastName?.trim() || "",
      email: profile.email?.trim() || "",
      phone: profile.phone?.trim() || "",
      isRegistered: true,
      // token: data.token, // when your backend returns one
    };
    set({ user });
    localStorage.setItem(LOCAL_KEY, JSON.stringify(user));
    return user;
  },

  login: async (creds) => {
    // TODO: call backend /api/auth/login, then:
    const user = { id: "demo", firstName: "Guest", isRegistered: true };
    set({ user });
    localStorage.setItem(LOCAL_KEY, JSON.stringify(user));
    return user;
  },

  logout: () => {
    set({ user: null });
    localStorage.removeItem(LOCAL_KEY);
  },
}));

export default useAuth;
