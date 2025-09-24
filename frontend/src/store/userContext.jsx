// src/store/userContext.jsx
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

// ---- keys / helpers ---------------------------------------------------------
const LS_KEY = "vsfoods:user";

function loadUser() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
function saveUser(u) {
  try {
    if (u) localStorage.setItem(LS_KEY, JSON.stringify(u));
    else localStorage.removeItem(LS_KEY);
  } catch {
    /* ignore */
  }
}

// Small helper to keep a friendly name handy in your UI (Navbar etc)
export function getDisplayName(user) {
  if (!user) return "";
  if (user.firstName) return user.firstName;
  if (user.name) return user.name.split(" ")[0];
  return "";
}

// ---- context ---------------------------------------------------------------
const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState(() => loadUser());

  // persist to localStorage whenever user changes
  useEffect(() => {
    saveUser(user);
  }, [user]);

  // simple login/logout shims you can call from Signup/Login flows
  const login = (profile) => {
    // profile can contain: { firstName, lastName, email?, phone?, id? }
    setUser((prev) => ({ ...prev, ...profile, authenticatedAt: Date.now() }));
  };

  const logout = () => setUser(null);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      setUser, // expose direct setter for rare cases (e.g., editing profile)
      login,
      logout,
    }),
    [user]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used inside <UserProvider>");
  return ctx;
}
