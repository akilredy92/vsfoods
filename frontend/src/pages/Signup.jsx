// src/pages/Signup.jsx
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useUser } from "../store/userContext";

export default function Signup() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useUser(); // or register() if you expose that

  // capture where the user came from
  const from = location.state?.from || "/";

  const [form, setForm] = useState({ email: "", password: "" });

  function set(k) {
    return (e) => setForm((s) => ({ ...s, [k]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    // mock: save user
    login({ email: form.email });
    // after signup, go back to the page they were on
    navigate(from, { replace: true });
  }

  return (
    <div className="container" style={{ maxWidth: 480, margin: "0 auto" }}>
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <div className="field">
          <label>Email</label>
          <input
            className="input"
            type="email"
            value={form.email}
            onChange={set("email")}
            required
          />
        </div>
        <div className="field">
          <label>Password</label>
          <input
            className="input"
            type="password"
            value={form.password}
            onChange={set("password")}
            required
          />
        </div>
        <button className="btn primary" style={{ marginTop: 12 }}>
          Sign Up
        </button>
      </form>
    </div>
  );
}
