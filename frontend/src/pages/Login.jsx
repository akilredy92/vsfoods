import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuth from "../store/auth";

export default function Login() {
  const nav = useNavigate();
  const { login, loading, error } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });

  const submit = async (e) => {
    e.preventDefault();
    const ok = await login(form.email, form.password);
    if (ok) nav("/");
  };

  return (
    <div className="container">
      <h2>Login</h2>
      <form onSubmit={submit} className="card" style={{ padding: "1rem", display: "grid", gap: ".75rem", maxWidth: 480 }}>
        <input className="input" type="email" placeholder="you@example.com"
               value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
        <input className="input" type="password" placeholder="Password"
               value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
        {error && <div style={{ color: "crimson" }}>{error}</div>}
        <button className="btn primary" disabled={loading}>{loading ? "Signing in…" : "Login"}</button>
        <div className="muted">No account? <Link to="/signup">Register & get 10% off</Link></div>
      </form>
    </div>
  );
}
