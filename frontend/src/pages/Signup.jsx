import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuth from "../store/auth";

export default function Signup() {
  const nav = useNavigate();
  const { signup, loading, error } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const submit = async (e) => {
    e.preventDefault();
    const ok = await signup(form.name, form.email, form.password);
    if (ok) nav("/");
  };

  return (
    <div className="container">
      <h2>Register — Get 10% off</h2>
      <form onSubmit={submit} className="card" style={{ padding: "1rem", display: "grid", gap: ".75rem", maxWidth: 480 }}>
        <input className="input" placeholder="Your name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
        <input className="input" type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
        <input className="input" type="password" placeholder="Create a password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
        {error && <div style={{ color: "crimson" }}>{error}</div>}
        <button className="btn primary" disabled={loading}>{loading ? "Creating…" : "Create account"}</button>
        <div className="muted">Already have an account? <Link to="/login">Login</Link></div>
      </form>
    </div>
  );
}
