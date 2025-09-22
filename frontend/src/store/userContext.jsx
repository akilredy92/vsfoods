import React, { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext(null);
const LS_KEY = "vsfoods_user_v1";

export function UserProvider({ children }) {
  const [user, setUser] = useState(null); // { firstName, lastName, email, phone, method }

  // Load from localStorage once
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch {}
  }, []);

  const login = (profile) => {
    const safe = {
      firstName: profile.firstName || "Customer",
      lastName: profile.lastName || "",
      email: profile.email || "",
      phone: profile.phone || "",
      method: profile.method || "email",
      isRegistered: true,
    };
    setUser(safe);
    try { localStorage.setItem(LS_KEY, JSON.stringify(safe)); } catch {}
  };

  const logout = () => {
    setUser(null);
    try { localStorage.removeItem(LS_KEY); } catch {}
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used inside <UserProvider>");
  return ctx;
}
