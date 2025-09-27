import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useUser } from "../store/userContext";
import { useCart } from "../store/cartContext";

/* ---------------- helpers ---------------- */
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

/* -------- shipping calculator (simple & self-contained) -------- */
function weightOf(item) {
  // assume price per pound items are 1 lb each by qty
  if ((item.unit || "").toLowerCase() === "lb") return qtyOf(item);
  // otherwise use optional item.weight or 0.5 lb fallback
  return qtyOf(item) * (Number(item.weight) || 0.5);
}
function calcShipping({ zip, subtotal, items }) {
  if (subtotal >= 100) return 0;

  const weight = items.reduce((w, it) => w + weightOf(it), 0);
  if (weight <= 0) return 0;

  let base;
  if (weight <= 5) base = 4.99;
  else if (weight <= 10) base = 8.99;
  else base = 13.99 + Math.ceil(weight - 10) * 0.75;

  // light local nudge (example for 275xx)
  if (zip && String(zip).startsWith("275")) base = Math.max(0, base - 2);

  return Number(base.toFixed(2));
}

/* -------- banner (now includes redirect state) -------- */
function RegisterDiscountBanner() {
  const location = useLocation();
  return (
    <div
      className="card"
      style={{
        padding: "10px 12px",
        borderRadius: 12,
        border: "1px solid #fde68a",
        background: "#fffbeb",
        display: "flex",
        gap: 12,
        alignItems: "center",
        justifyContent: "space-between",
        margin: "12px 0",
      }}
    >
      <div style={{ lineHeight: 1.25 }}>
        <div style={{ fontWeight: 800 }}>Register & get 5% off</div>
        <div className="muted" style={{ fontSize: ".95rem" }}>
          Create a free account and your order gets an instant 5% discount at checkout.
        </div>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <Link
          className="btn primary"
          to="/signup"
          state={{ from: location.pathname }} // 👈 return here after signup
        >
          Register
        </Link>
        <Link
          className="btn ghost"
          to="/login"
          state={{ from: location.pathname }} // 👈 return here after login
        >
          Login
        </Link>
      </div>
    </div>
  );
}

/* ---------------- page ---------------- */
export default function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();

  // user
  let userCtx = {};
  try { userCtx = useUser(); } catch {}
  const user = userCtx?.user || null;

  // cart context (adapt to whatever your store exposes)
  let cartCtx = {};
  try { cartCtx = useCart(); } catch {}
  const cart = Array.isArray(cartCtx?.cart) ? cartCtx.cart : [];

  const updateQty  = cartCtx?.updateQty;
  const increment  = cartCtx?.increment;
  const decrement  = cartCtx?.decrement;
  const removeItem = cartCtx?.removeItem;
  const remove     = cartCtx?.remove;
  const dispatch   = cartCtx?.dispatch;
  const clearCart  = cartCtx?.clearCart || (() => {});

  // robust quantity controls that try multiple API shapes
  function setQty(item, next) {
    const target = Math.max(1, Math.min(99, Number(next) || 1));
    const k = keyOf(item);

    // preferred direct update
    if (tryCall(updateQty, k, target)) return;
    if (tryCall(updateQty, item, target)) return;

    // fallback via inc/dec loops
    const current = qtyOf(item);
    if (target > current) {
      const steps = target - current;
      for (let i = 0; i < steps; i++) {
        if (tryCall(increment, k)) continue;
        if (tryCall(dispatch, { type: "INCREMENT", payload: k })) continue;
      }
      return;
    }
    if (target < current) {
      const steps = current - target;
      for (let i = 0; i < steps; i++) {
        if (tryCall(decrement, k)) continue;
        if (tryCall(dispatch, { type: "DECREMENT", payload: k })) continue;
      }
      return;
    }
  }
  function inc(item) {
    const k = keyOf(item);
    if (tryCall(increment, k)) return;
    if (tryCall(dispatch, { type: "INCREMENT", payload: k })) return;
    setQty(item, qtyOf(item) + 1);
  }
  function dec(item) {
    if (qtyOf(item) <= 1) return;
    const k = keyOf(item);
    if (tryCall(decrement, k)) return;
    if (tryCall(dispatch, { type: "DECREMENT", payload: k })) return;
    setQty(item, qtyOf(item) - 1);
  }
  function removeLine(item) {
    const k = keyOf(item);
    if (tryCall(removeItem, k)) return;
    if (tryCall(remove, k)) return;
    if (tryCall(dispatch, { type: "REMOVE", payload: k })) return;
    if (tryCall(updateQty, k, 0)) return;
  }

  // form (persist name/address briefly for user convenience)
  const [form, setForm] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("vsf_checkout_contact") || "null");
      if (saved && typeof saved === "object") return saved;
    } catch {}
    return {
      firstName: user?.firstName || "",
      lastName:  user?.lastName  || "",
      address1:  "",
      address2:  "",
      city:      "",
      state:     "",
      zip:       "",
      email:     user?.email || "",
      phone:     "",
    };
  });
  const set = (k) => (e) => setForm((s) => ({ ...s, [k]: e.target.value }));

  // totals
  const subtotal = useMemo(
    () => cart.reduce((n, it) => n + (Number(it.price) || 0) * qtyOf(it), 0),
    [cart]
  );
  const [shipping, setShipping] = useState(0);

  useEffect(() => {
    setShipping(calcShipping({ zip: form.zip, subtotal, items: cart }));
  }, [form.zip, subtotal, cart]);

  const tax = 0;
  const total = subtotal + shipping + tax;

  function goToPayment(e) {
    e.preventDefault();
    if (!form.firstName || !form.lastName || !form.address1 || !form.city || !form.state || !form.zip) {
      // NOTE: alert() should be replaced with a custom modal in production
      alert("Please complete your name and delivery address.");
      return;
    }
    if (!form.email && !form.phone) {
      // NOTE: alert() should be replaced with a custom modal in production
      alert("Please provide email or phone.");
      return;
    }
    try { localStorage.setItem("vsf_checkout_contact", JSON.stringify(form)); } catch {}
    navigate("/payment");
  }

  return (
    <div className="container" style={{ maxWidth: 980, margin: "0 auto", paddingBottom: "2rem" }}>
      {!user && cart.length > 0 && <RegisterDiscountBanner />}

      {user && (
        <div className="card" style={{ padding: "0.75rem 1rem", borderRadius: 12, margin: "12px 0" }}>
          <strong>Hi {user.firstName || "Customer"}!</strong>
        </div>
      )}

      {/* Cart */}
      <div className="card" style={{ padding: "1.2rem", borderRadius: 16 }}>
        <h2 style={{ margin: 0 }}>Your Cart</h2>

        {cart.length === 0 ? (
          <div style={{ marginTop: 12 }}>
            <p className="muted">Your cart is empty.</p>
            <Link className="btn" to="/products">Browse products</Link>
          </div>
        ) : (
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
        )}
      </div>

      {/* Summary */}
      <div className="card" style={{ padding: "1rem 1.2rem", marginTop: "1rem", borderRadius: 16, display: "grid", gap: 6 }}>
        <div className="row" style={{ justifyContent: "space-between" }}>
          <span className="muted">Subtotal</span>
          <strong>${subtotal.toFixed(2)}</strong>
        </div>
        <div className="row" style={{ justifyContent: "space-between" }}>
          <span className="muted">Shipping</span>
          <strong>${shipping.toFixed(2)}</strong>
        </div>
        <div className="row" style={{ justifyContent: "space-between" }}>
          <span className="muted">Tax</span>
          <strong>${tax.toFixed(2)}</strong>
        </div>
        <div className="row" style={{ justifyContent: "space-between", marginTop: 4 }}>
          <span style={{ fontWeight: 700 }}>Total</span>
          <span style={{ fontWeight: 800 }}>${total.toFixed(2)}</span>
        </div>
        <div className="hint" style={{ marginTop: 6 }}>
          Enter ZIP below to update shipping automatically.
        </div>
      </div>

      {/* Address / Contact */}
      <div className="card" style={{ padding: "1.2rem", marginTop: "1rem", borderRadius: 16 }}>
        <h2 style={{ marginTop: 0 }}>Delivery Details</h2>

        <form className="form" onSubmit={goToPayment}>
          <div className="row" style={{ gap: 12 }}>
            <div style={{ flex: 1 }} className="field">
              <label>First name *</label>
              <input className="input" style={{ height: 48 }} value={form.firstName} onChange={set("firstName")} required />
            </div>
            <div style={{ flex: 1 }} className="field">
              <label>Last name *</label>
              <input className="input" style={{ height: 48 }} value={form.lastName} onChange={set("lastName")} required />
            </div>
          </div>

          <div className="field">
            <label>Address line 1 *</label>
            <input className="input" style={{ height: 48 }} value={form.address1} onChange={set("address1")} required />
          </div>

          <div className="field">
            <label>Address line 2</label>
            <input className="input" style={{ height: 48 }} value={form.address2} onChange={set("address2")} />
          </div>

          <div className="row" style={{ gap: 12 }}>
            <div style={{ flex: 1 }} className="field">
              <label>City *</label>
              <input className="input" style={{ height: 48 }} value={form.city} onChange={set("city")} required />
            </div>
            <div style={{ width: 140 }} className="field">
              <label>State *</label>
              <input className="input" style={{ height: 48 }} value={form.state} onChange={set("state")} required />
            </div>
            <div style={{ width: 160 }} className="field">
              <label>ZIP *</label>
              <input className="input" style={{ height: 48 }} value={form.zip} onChange={set("zip")} required />
            </div>
          </div>

          {/* FIX: Moved hint text out of the field div to prevent misalignment */}
          <div className="row" style={{ gap: 12, alignItems: 'flex-start' }}>
            <div style={{ flex: 1 }} className="field">
              <label>Email</label>
              <input className="input" style={{ height: 48 }} type="email" value={form.email} onChange={set("email")} />
            </div>
            <div style={{ flex: 1 }} className="field">
              <label>Phone</label>
              <input className="input" style={{ height: 48 }} value={form.phone} onChange={set("phone")} />
            </div>
          </div>
          {/* HINT is now outside the row to affect both fields equally, or just display below them */}
          <div className="hint" style={{ marginTop: -12, marginBottom: 8 }}>
            Provide either email or phone.
          </div>

          <div style={{ marginTop: 8 }}>
            <button className="btn primary" style={{ width: "100%", height: 52 }} onClick={goToPayment}>
              Go to Payment
            </button>
          </div>

          <div className="row" style={{ marginTop: 8, justifyContent: "space-between" }}>
            <Link className="btn ghost" to="/cart">Back to cart</Link>
            {cart.length > 0 && (
              <button type="button" className="btn ghost" onClick={() => confirm("Clear the cart?") && clearCart()}>
                Clear cart
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
