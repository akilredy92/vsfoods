// src/pages/Checkout.jsx
import React, { useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useUser } from "../store/userContext.jsx";
import { useCart } from "../store/cartContext.jsx";

export default function Checkout() {
  const navigate = useNavigate();
  const { user } = useUser();
  const cart = (() => {
    try {
      return useCart();
    } catch {
      return {};
    }
  })();

  // Pre-fill from user if available
  const [form, setForm] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    zip: "",
    email: user?.email || "",
    phone: user?.phone || "",
  });

  const onChange = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  // Simple, defensive item count for header/badge etc.
  const itemCount = useMemo(() => {
    const qtyOf = (l) => Number(l?.qty ?? l?.quantity ?? 1);
    const lines =
      Array.isArray(cart?.items) ? cart.items :
      Array.isArray(cart?.cart) ? cart.cart :
      Array.isArray(cart) ? cart : [];
    return lines.reduce((n, it) => n + qtyOf(it), 0);
  }, [cart]);

  const goToPayment = (e) => {
    e.preventDefault();
    // TODO: validate as needed, then navigate to your payment route
    navigate("/payment", { state: { shipping: form } });
  };

  // Shared input style: tall, comfy, accessible
  const inputStyle = {
    height: 56,
    fontSize: 18,
    padding: "0 14px",
    border: "1px solid var(--border, #e5e7eb)",
    borderRadius: 10,
    background: "#eef3ff33",
    outline: "none",
    width: "100%",
  };

  const labelStyle = { fontSize: 14, fontWeight: 600, color: "var(--text,#111827)" };

  return (
    <div className="container" style={{ padding: "1rem 1rem 2rem" }}>
      <div
        className="card"
        style={{
          padding: "1.25rem",
          borderRadius: 16,
          boxShadow: "var(--shadow, 0 10px 25px rgba(0,0,0,.06))",
          background: "#fff",
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 16 }}>
          <h1 style={{ margin: 0, fontSize: 34, lineHeight: 1.15 }}>Checkout</h1>
          {itemCount > 0 && (
            <span className="muted" style={{ fontSize: 14 }}>
              ({itemCount} {itemCount === 1 ? "item" : "items"})
            </span>
          )}
        </div>

        {/* If you had a “register for 5% off” banner for guests, you can keep/show it conditionally here */}

        <form onSubmit={goToPayment} style={{ display: "grid", gap: 16 }}>
          {/* Name */}
          <div
            style={{
              display: "grid",
              gap: 12,
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            }}
          >
            <div style={{ display: "grid", gap: 6 }}>
              <label style={labelStyle} htmlFor="first">First name</label>
              <input
                id="first"
                style={inputStyle}
                value={form.firstName}
                onChange={onChange("firstName")}
                placeholder="First name"
                autoComplete="given-name"
              />
            </div>

            <div style={{ display: "grid", gap: 6 }}>
              <label style={labelStyle} htmlFor="last">Last name</label>
              <input
                id="last"
                style={inputStyle}
                value={form.lastName}
                onChange={onChange("lastName")}
                placeholder="Last name"
                autoComplete="family-name"
              />
            </div>
          </div>

          {/* Address lines */}
          <div style={{ display: "grid", gap: 12 }}>
            <div style={{ display: "grid", gap: 6 }}>
              <label style={labelStyle} htmlFor="addr1">Address line 1</label>
              <input
                id="addr1"
                style={inputStyle}
                value={form.address1}
                onChange={onChange("address1")}
                placeholder="Street address"
                autoComplete="address-line1"
                required
              />
            </div>

            <div style={{ display: "grid", gap: 6 }}>
              <label style={labelStyle} htmlFor="addr2">Address line 2 (optional)</label>
              <input
                id="addr2"
                style={inputStyle}
                value={form.address2}
                onChange={onChange("address2")}
                placeholder="Apt, suite, etc."
                autoComplete="address-line2"
              />
            </div>
          </div>

          {/* City / State / Zip */}
          <div
            style={{
              display: "grid",
              gap: 12,
              gridTemplateColumns: "2fr 1fr 1fr",
            }}
          >
            <div style={{ display: "grid", gap: 6 }}>
              <label style={labelStyle} htmlFor="city">City</label>
              <input
                id="city"
                style={inputStyle}
                value={form.city}
                onChange={onChange("city")}
                placeholder="City"
                autoComplete="address-level2"
              />
            </div>

            <div style={{ display: "grid", gap: 6 }}>
              <label style={labelStyle} htmlFor="state">State</label>
              <input
                id="state"
                style={inputStyle}
                value={form.state}
                onChange={onChange("state")}
                placeholder="State"
                autoComplete="address-level1"
              />
            </div>

            <div style={{ display: "grid", gap: 6 }}>
              <label style={labelStyle} htmlFor="zip">ZIP</label>
              <input
                id="zip"
                style={inputStyle}
                value={form.zip}
                onChange={onChange("zip")}
                placeholder="ZIP"
                inputMode="numeric"
                autoComplete="postal-code"
              />
            </div>
          </div>

          {/* Contact */}
          <div
            style={{
              display: "grid",
              gap: 12,
              gridTemplateColumns: "1fr 1fr",
            }}
          >
            <div style={{ display: "grid", gap: 6 }}>
              <label style={labelStyle} htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                style={inputStyle}
                value={form.email}
                onChange={onChange("email")}
                placeholder="you@example.com"
                autoComplete="email"
              />
            </div>

            <div style={{ display: "grid", gap: 6 }}>
              <label style={labelStyle} htmlFor="phone">Phone</label>
              <input
                id="phone"
                style={inputStyle}
                value={form.phone}
                onChange={onChange("phone")}
                placeholder="(555) 555-5555"
                inputMode="tel"
                autoComplete="tel"
              />
            </div>
          </div>

          {/* Actions */}
          <div
            style={{
              display: "grid",
              gap: 10,
              gridTemplateColumns: "1fr",
              marginTop: 8,
            }}
          >
            <button
              type="submit"
              className="btn primary"
              style={{
                height: 56,
                fontSize: 18,
                borderRadius: 12,
                background: "var(--brand, #111827)",
                color: "#fff",
              }}
            >
              Go to payment
            </button>

            <div style={{ textAlign: "center" }}>
              <Link to="/cart" className="muted" style={{ textDecoration: "underline" }}>
                Back to cart
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
