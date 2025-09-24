import React, { useState } from "react";
import { sendContact } from "../api/client"; // <-- single import

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    orderId: "",
    message: "",
  });
  const [status, setStatus] = useState("");
  const [sending, setSending] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setSending(true);
    setStatus("Sending…");
    try {
      await sendContact(form);           // make sure client.js exports this
      setStatus("Thanks! We’ll reach out shortly.");
      setForm({ name: "", email: "", orderId: "", message: "" });
    } catch (err) {
      console.error(err);
      setStatus("Could not send right now. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: 720 }}>
      <h2 style={{ margin: "1rem 0" }}>Contact the Store</h2>

      <form onSubmit={submit} className="card" style={{ padding: "1rem", display: "grid", gap: ".75rem" }}>
        <input
          className="input"
          name="name"
          required
          placeholder="Your name"
          value={form.name}
          onChange={handleChange}
        />

        <input
          className="input"
          name="email"
          type="email"
          required
          placeholder="you@example.com"
          value={form.email}
          onChange={handleChange}
        />

        <input
          className="input"
          name="orderId"
          placeholder="Order ID (optional)"
          value={form.orderId}
          onChange={handleChange}
        />

        <textarea
          className="input"
          name="message"
          required
          rows={5}
          placeholder="How can we help?"
          value={form.message}
          onChange={handleChange}
        />

        <button className="btn primary" disabled={sending}>
          {sending ? "Sending…" : "Send"}
        </button>

        {status && <div className="muted">{status}</div>}
      </form>
    </div>
  );
}
