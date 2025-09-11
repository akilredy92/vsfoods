//cat > frontend/src/pages/Checkout.jsx <<'EOF'
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useCart from "../store/cart";
import { createOrder } from "../api/client";

export default function Checkout() {
  const items = useCart(s => s.items);
  const total = useCart(s => s.total)();
  const clear = useCart(s => s.clear);
  const nav = useNavigate();
  const [customer, setCustomer] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      const order = await createOrder({ items, customer });
      clear();
      nav(`/order-success/${order.orderId}`);
    } catch (err) {
      setError("Failed to place order. Try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!items.length) {
    return <div className="container">Your cart is empty.</div>;
  }

  return (
    <div className="container">
      <h2>Checkout</h2>
      <form onSubmit={submit} className="card" style={{ padding: "1rem" }}>
        <div className="row">
          <input
            required
            placeholder="Your name"
            value={customer.name}
            onChange={e => setCustomer({ ...customer, name: e.target.value })}
            style={{ padding: "0.6rem 0.8rem", borderRadius: 10, border: "1px solid #ddd", width: "50%" }}
          />
          <input
            required
            type="email"
            placeholder="you@example.com"
            value={customer.email}
            onChange={e => setCustomer({ ...customer, email: e.target.value })}
            style={{ padding: "0.6rem 0.8rem", borderRadius: 10, border: "1px solid #ddd", width: "50%" }}
          />
        </div>
        <div style={{ marginTop: 12 }}>
          <strong>Order total: ${total.toFixed(2)}</strong>
        </div>
        {error && <div style={{ color: "crimson", marginTop: 8 }}>{error}</div>}
        <div style={{ marginTop: 12 }}>
          <button className="btn primary" disabled={loading}>{loading ? "Placing…" : "Place order"}</button>
        </div>
        <p className="muted" style={{ marginTop: 8 }}>This is a demo checkout — no real payment is processed.</p>
      </form>
    </div>
  );
}

