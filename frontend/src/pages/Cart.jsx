import React from "react";
import { Link } from "react-router-dom";
import useCart from "../store/cart";

export default function Cart() {
  // pull everything we need from the zustand store
  const items = useCart((s) => s.items) || [];
  const inc = useCart((s) => s.inc);
  const dec = useCart((s) => s.dec);
  const remove = useCart((s) => s.remove);
  const subtotal = useCart((s) => s.subtotal);

  // guard against store not being ready to avoid crashes
  const safeItems = Array.isArray(items) ? items : [];

  if (!safeItems.length) {
    return (
      <div className="container" style={{ padding: "1rem 0" }}>
        <h1>Your Cart</h1>
        <p className="muted">Your cart is empty.</p>
        <Link className="btn primary" to="/products">Browse products</Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: "1rem 0" }}>
      <h1 style={{ marginBottom: 12 }}>Your Cart</h1>

      <div className="grid" style={{ gap: "1rem" }}>
        {safeItems.map((it) => (
          <div key={it.id} className="card" style={{ display: "grid", gridTemplateColumns: "96px 1fr auto", gap: 12, alignItems: "center" }}>
            <img
              src={it.image || "/images/placeholder.jpg"}
              alt={it.name}
              onError={(e) => (e.currentTarget.src = "/images/placeholder.jpg")}
              style={{ width: 96, height: 96, objectFit: "cover", borderTopLeftRadius: 14, borderBottomLeftRadius: 14 }}
            />

            <div className="card-body" style={{ padding: "0.8rem 0" }}>
              <h3 style={{ margin: 0 }}>{it.name}</h3>
              <p className="muted" style={{ margin: 0 }}>
                ${Number(it.price).toFixed(2)}/{it.unit || "lb"}
              </p>

              <div className="row" style={{ marginTop: 8, gap: 8 }}>
                <div className="qty">
                  <button onClick={() => dec(it.id)}>−</button>
                  <input readOnly value={Number(it.quantity) || 1} />
                  <button onClick={() => inc(it.id)}>+</button>
                </div>
                <button className="btn" onClick={() => remove(it.id)}>Remove</button>
              </div>
            </div>

            <div style={{ paddingRight: 12, fontWeight: 700 }}>
              ${(Number(it.price) * Number(it.quantity || 0)).toFixed(2)}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 16 }}>
        <Link to="/products" className="btn">Continue shopping</Link>

        <div className="row" style={{ alignItems: "center", gap: 16 }}>
          <div className="price">Subtotal: ${subtotal().toFixed(2)}</div>
          <Link to="/checkout" className="btn primary">Checkout</Link>
        </div>
      </div>
    </div>
  );
}
