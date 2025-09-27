import React, { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../store/cartContext";

/* ---------- tiny helpers ---------- */
function keyOf(item) {
  return item?.id ?? item?.slug ?? item?.name ?? String(item?.sku ?? "");
}
function qtyOf(item) {
  return Number(item?.quantity ?? item?.qty ?? item?.count ?? 1);
}
function tryCall(fn, ...args) {
  try {
    if (typeof fn === "function") {
      fn(...args);
      return true;
    }
  } catch {}
  return false;
}

export default function Cart() {
  const navigate = useNavigate();

  // Make this page tolerant of hot reloads (won't crash if provider isn't ready)
  let ctx = {};
  try { ctx = useCart(); } catch {}

  const cart       = Array.isArray(ctx?.cart) ? ctx.cart : [];
  const increment  = ctx?.increment;
  const decrement  = ctx?.decrement;
  const updateQty  = ctx?.updateQty;
  const remove     = ctx?.remove; // This is a potential fallback name
  const removeItem = ctx?.removeItem; // This is the exposed function name
  const dispatch   = ctx?.dispatch;

  /* ---------- qty/change actions (robust) ---------- */
  function setQty(item, next) {
    const target = Math.max(1, Math.min(99, Number(next) || 1));
    const k = keyOf(item);

    // Preferred: direct update
    if (tryCall(updateQty, k, target)) return;
    if (tryCall(updateQty, item, target)) return;

    // Fallback: simulate with inc/dec loops
    const current = qtyOf(item);
    if (target > current) {
      for (let i = 0; i < target - current; i++) {
        if (tryCall(increment, k)) continue;
        if (tryCall(dispatch, { type: "INCREMENT", payload: { key: k } })) continue;
      }
      return;
    }
    if (target < current) {
      for (let i = 0; i < current - target; i++) {
        if (tryCall(decrement, k)) continue;
        if (tryCall(dispatch, { type: "DECREMENT", payload: { key: k } })) continue;
        if (tryCall(dispatch, { type: "REMOVE_ONE", payload: { key: k } })) continue;
      }
      return;
    }
  }

  function inc(item) {
    const k = keyOf(item);
    if (tryCall(increment, k)) return;
    if (tryCall(dispatch, { type: "INCREMENT", payload: { key: k } })) return;
    if (tryCall(dispatch, { type: "ADD_ONE", payload: { key: k } })) return;
    setQty(item, qtyOf(item) + 1);
  }

  function dec(item) {
    const q = qtyOf(item);
    if (q <= 1) return; // don’t go below 1

    const k = keyOf(item);
    // Try common decrement methods
    if (tryCall(decrement, k)) return;
    if (tryCall(dispatch, { type: "DECREMENT", payload: { key: k } })) return;
    if (tryCall(dispatch, { type: "REMOVE_ONE", payload: { key: k } })) return;

    // final fallback
    setQty(item, q - 1);
  }

  function removeLine(item) {
    const k = keyOf(item);
    if (tryCall(removeItem, k)) return; // Use the properly exposed function
    if (tryCall(remove, k)) return; // Use fallback name if defined
    if (tryCall(dispatch, { type: "REMOVE", payload: { key: k } })) return; // Dispatch REMOVE action
    if (tryCall(updateQty, k, 0)) return;
  }

  /* ---------- totals ---------- */
  const subtotal = useMemo(
    () => cart.reduce((n, it) => n + (Number(it.price) || 0) * qtyOf(it), 0),
    [cart]
  );

  return (
    <div className="container" style={{ maxWidth: 980, margin: "0 auto", paddingBottom: "2rem" }}>

      {/* Removed the duplicate "← Add more" button here.
        It is retained at the bottom of the summary card.
      */}
      <div className="row" style={{ alignItems: "center", justifyContent: "space-between" }}>
        <h2 style={{ margin: 0 }}>Your Cart</h2>
      </div>

      <div className="card" style={{ padding: "1.2rem", borderRadius: 16, marginTop: 12 }}>
        {cart.length === 0 ? (
          <div>
            <p className="muted">Your cart is empty.</p>
            <Link className="btn" to="/products">Browse products</Link>
          </div>
        ) : (
          <div style={{ display: "grid", gap: 10 }}>
            {cart.map((item) => {
              const q = qtyOf(item);
              const lineTotal = (Number(item.price) || 0) * q;
              return (
                <div
                  key={keyOf(item)}
                  className="row"
                  style={{
                    alignItems: "center",
                    gap: 12,
                    padding: "10px 0",
                    borderBottom: "1px solid #eee",
                  }}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{ width: 64, height: 64, borderRadius: 10, objectFit: "cover" }}
                  />

                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700 }}>{item.name}</div>
                    <div className="muted">
                      ${Number(item.price).toFixed(2)} / {item.unit || "lb"}
                    </div>
                  </div>

                  <div className="qty">
                    <button onClick={() => dec(item)} disabled={q <= 1}>−</button>
                    <input readOnly value={q} />
                    <button onClick={() => inc(item)}>+</button>
                  </div>

                  <div style={{ fontWeight: 700, minWidth: 90, textAlign: "right" }}>
                    ${lineTotal.toFixed(2)}
                  </div>

                  <button className="btn ghost" onClick={() => removeLine(item)}>
                    Remove
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Summary & checkout CTA */}
      <div className="card" style={{ padding: "1rem 1.2rem", marginTop: 12, borderRadius: 16 }}>
        <div className="row" style={{ justifyContent: "space-between" }}>
          <span className="muted">Subtotal</span>
          <strong>${subtotal.toFixed(2)}</strong>
        </div>

        <div className="row" style={{ marginTop: 10, justifyContent: "space-between" }}>
          <Link to="/products" className="btn ghost">← Add more</Link>
          <button
            className="btn primary"
            onClick={() => navigate("/checkout")}
            disabled={cart.length === 0}
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
