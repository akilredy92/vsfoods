import React, { useState } from "react";
import { sendContact } from "../api/client"; // make sure this exists in src/api/client.js

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", orderId: "", message: "" });
  const [status, setStatus] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setStatus("Sending...");
    try {
      await sendContact(form);
      setStatus("Thanks! We’ll reach out shortly.");
      setForm({ name: "", email: "", orderId: "", message: "" });
    } catch {
      setStatus("Could not send right now. Please try again.");
    }
  };

  return (
    <div className="container">
      <h2>Contact the Store</h2>
      <form onSubmit={submit} className="card" style={{ padding: "1rem", display: "grid", gap: ".75rem", maxWidth: 720 }}>
        <input className="input" required placeholder="Your name"
               value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
        <input className="input" required type="email" placeholder="you@example.com"
               value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
        <input className="input" placeholder="Order ID (optional)"
               value={form.orderId} onChange={e => setForm({ ...form, orderId: e.target.value })} />
        <textarea className="input" required rows={5} placeholder="Message"
                  value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} />
        <button className="btn primary">Send</button>
        {status && <div className="muted">{status}</div>}
      </form>
    </div>
  );
}
