import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useCart from "../store/cart";
import useAuth from "../store/auth";
import { createOrder } from "../api/client";

export default function Checkout() {
  const items = useCart(s => s.items);
  const totalLocal = useCart(s => s.total)(); // local calc (no discount)
  const clear = useCart(s => s.clear);
  const { user } = useAuth();
  const nav = useNavigate();

  const [customer, setCustomer] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(false);
  const [serverTotal, setServerTotal] = useState(null);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      const order = await createOrder({ items, customer });
      setServerTotal(order.total);
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

  // simple estimate: if logged in, show 10% off preview (final total from server)
  const estimatedDiscount = user ? +(totalLocal * 0.10).toFixed(2) : 0;
  const estimatedTotal = user ? +(totalLocal - estimatedDiscount).toFixed(2) : totalLocal;

  return (
    <div className="container">
      <h2>Checkout</h2>

      {!user && (
        <div className="card strip" style={{ padding: ".8rem 1rem", marginBottom: "1rem" }}>
          <strong>Register & get 10% off!</strong>
          <div className="muted">Create a free account and your order gets an instant discount.</div>
          <div style={{ marginTop: 8 }}>
            <Link className="btn primary" to="/signup">Register now</Link>
          </div>
        </div>
      )}

      <form onSubmit={submit} className="card" style={{ padding: "1rem", display: "grid", gap: "0.75rem" }}>
        <div className="row">
          <input
            required
            placeholder="Your name"
            value={customer.name}
            onChange={e => setCustomer({ ...customer, name: e.target.value })}
            className="input"
            style={{ width: "50%" }}
          />
          <input
            required
            type="email"
            placeholder="you@example.com"
            value={customer.email}
            onChange={e => setCustomer({ ...customer, email: e.target.value })}
            className="input"
            style={{ width: "50%" }}
          />
        </div>

        <div>
          <div className="row" style={{ justifyContent: "space-between" }}>
            <span>Subtotal</span>
            <strong>${totalLocal.toFixed(2)}</strong>
          </div>
          {user && (
            <>
              <div className="row" style={{ justifyContent: "space-between" }}>
                <span>Member discount (10%)</span>
                <strong>- ${estimatedDiscount.toFixed(2)}</strong>
              </div>
              <div className="row" style={{ justifyContent: "space-between" }}>
                <span>Estimated total</span>
                <strong>${estimatedTotal.toFixed(2)}</strong>
              </div>
            </>
          )}
        </div>

        {error && <div style={{ color: "crimson" }}>{error}</div>}

        <button className="btn primary" disabled={loading}>{loading ? "Placing…" : "Place order"}</button>
        <p className="muted" style={{ marginTop: 8 }}>This is a demo checkout — no real payment is processed.</p>
      </form>
    </div>
  );
}

