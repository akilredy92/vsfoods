import React, { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../store/cartContext";

/* ---------- helpers (identical approach as Checkout) ---------- */
function tryCall(fn, ...args) {
  try {
    if (typeof fn === "function") {
      fn(...args);
      return true;
    }
  } catch {}
  return false;
}
function keyOf(item) {
  return item?.id ?? item?.slug ?? item?.name ?? String(item?.sku ?? "");
}
function qtyOf(item) {
  return Number(item?.quantity ?? item?.qty ?? item?.count ?? 1);
}

export default function Cart() {
  const navigate = useNavigate();

  let cartCtx = {};
  try { cartCtx = useCart(); } catch {}
  const cart = Array.isArray(cartCtx?.cart) ? cartCtx.cart : [];

  const updateQty   = cartCtx?.updateQty;
  const increment   = cartCtx?.increment;
  const decrement   = cartCtx?.decrement;
  const add         = cartCtx?.add;
  const addItem     = cartCtx?.addItem;
  const removeItem  = cartCtx?.removeItem;
  const remove      = cartCtx?.remove;
  const dispatch    = cartCtx?.dispatch;
  const clearCart   = cartCtx?.clearCart || (() => {});

  function setQty(item, nextQty) {
    const target = Math.max(1, Math.min(99, Number(nextQty) || 1));
    const k = keyOf(item);

    if (tryCall(updateQty, k, target)) return;
    if (tryCall(updateQty, item, target)) return;

    const current = qtyOf(item);

    if (target > current) {
      const incCount = target - current;
      for (let i = 0; i < incCount; i++) {
        if (tryCall(increment, k)) continue;
        if (tryCall(increment, item)) continue;
        if (tryCall(addItem, item, 1)) continue;
        if (tryCall(add, item, 1)) continue;
        if (tryCall(dispatch, { type: "INCREMENT", payload: k })) continue;
        if (tryCall(dispatch, { type: "ADD", payload: { product: item, qty: 1 } })) continue;
      }
      return;
    }
    if (target < current) {
      const decCount = current - target;
      for (let i = 0; i < decCount; i++) {
        if (tryCall(decrement, k)) continue;
        if (tryCall(decrement, item)) continue;
        if (tryCall(dispatch, { type: "DECREMENT", payload: k })) continue;
        if (tryCall(dispatch, { type: "REMOVE_ONE", payload: k })) continue;
      }
      return;
    }
  }
  const inc = (item) => setQty(item, qtyOf(item) + 1);
  const dec = (item) => qtyOf(item) > 1 && setQty(item, qtyOf(item) - 1);

  function removeLine(item) {
    const k = keyOf(item);
    if (tryCall(removeItem, k)) return;
    if (tryCall(removeItem, item)) return;
    if (tryCall(remove, k)) return;
    if (tryCall(remove, item)) return;
    if (tryCall(dispatch, { type: "REMOVE", payload: k })) return;
    if (tryCall(updateQty, k, 0)) return;
    tryCall(updateQty, item, 0);
  }

  const subtotal = useMemo(
    () => cart.reduce((n, it) => n + (Number(it.price) || 0) * qtyOf(it), 0),
    [cart]
  );

  return (
    <div className="container" style={{ maxWidth: 980, margin: "0 auto", paddingBottom: "2rem" }}>
      <div className="card" style={{ padding: "1.2rem", borderRadius: 16 }}>
        <h2 style={{ margin: 0 }}>Your Cart</h2>

        {cart.length === 0 ? (
          <div style={{ marginTop: 12 }}>
            <p className="muted">Your cart is empty.</p>
            <Link className="btn" to="/products">Browse products</Link>
          </div>
        ) : (
          <>
            <div style={{ marginTop: 12 }}>
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

            <div className="card" style={{ marginTop: 12, padding: "1rem", borderRadius: 12 }}>
              <div className="row" style={{ justifyContent: "space-between" }}>
                <span className="muted">Subtotal</span>
                <strong>${subtotal.toFixed(2)}</strong>
              </div>
              <div className="hint" style={{ marginTop: 6 }}>
                Shipping is calculated on the Checkout page after you enter a ZIP code.
              </div>
              <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
                <Link className="btn primary" to="/checkout">Checkout</Link>
                <button className="btn ghost" type="button" onClick={() => (confirm("Clear the cart?") && clearCart())}>
                  Clear cart
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
