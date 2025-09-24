// src/pages/Cart.jsx
import React, { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../store/cartContext.jsx";

/** Pull an array of cart lines out of any common cart context shape */
function useCartLines() {
  try {
    const ctx = useCart();

    // Prefer explicit arrays
    if (Array.isArray(ctx?.items)) return [ctx, ctx.items];
    if (Array.isArray(ctx?.cart)) return [ctx, ctx.cart];

    // Redux-like state
    if (Array.isArray(ctx?.state?.items)) return [ctx, ctx.state.items];
    if (Array.isArray(ctx?.state?.cart)) return [ctx, ctx.state.cart];

    // Nothing yet (e.g., during hot-reload) → empty
    return [ctx, []];
  } catch {
    // Provider not mounted yet → empty
    return [undefined, []];
  }
}

/** Get a numeric count for the navbar badge etc. */
function linesCount(lines) {
  return lines.reduce((n, line) => n + (Number(line?.qty ?? line?.quantity ?? 1) || 0), 0);
}

/** Get per-line info regardless of field names */
function normalizeLine(line) {
  const product = line.product ?? line.item ?? line;
  const qty = Number(line.qty ?? line.quantity ?? 1) || 1;
  const price = Number(product?.price ?? line.price ?? 0) || 0;

  return {
    id: product?.id ?? product?.slug ?? product?.name ?? line.id,
    name: product?.name ?? line.name ?? "Item",
    image: product?.image ?? line.image,
    unit: product?.unit ?? "lb",
    price,
    qty,
    product,
    raw: line,
    total: price * qty,
  };
}

export default function Cart() {
  const navigate = useNavigate();
  const [ctx, rawLines] = useCartLines();

  const lines = useMemo(() => rawLines.map(normalizeLine), [rawLines]);

  const subtotal = useMemo(
    () => lines.reduce((s, l) => s + l.total, 0),
    [lines]
  );

  // --- Cart API adapters (work across different context implementations) ---
  const setQty = (line, nextQty) => {
    if (!ctx) return;

    // common APIs first
    if (typeof ctx.updateQty === "function") return ctx.updateQty(line.product, nextQty);
    if (typeof ctx.setQty === "function") return ctx.setQty(line.product, nextQty);
    if (typeof ctx.addToCart === "function") return ctx.addToCart(line.product, nextQty); // some libs overwrite
    if (typeof ctx.addItem === "function") return ctx.addItem(line.product, nextQty);

    // reducer-style
    if (typeof ctx.dispatch === "function") {
      return ctx.dispatch({ type: "SET_QTY", payload: { product: line.product, qty: nextQty } });
    }
  };

  const removeLine = (line) => {
    if (!ctx) return;

    if (typeof ctx.removeFromCart === "function") return ctx.removeFromCart(line.product);
    if (typeof ctx.removeItem === "function") return ctx.removeItem(line.product);

    if (typeof ctx.dispatch === "function") {
      return ctx.dispatch({ type: "REMOVE", payload: { product: line.product } });
    }
  };

  const clearCart = () => {
    if (!ctx) return;

    if (typeof ctx.clearCart === "function") return ctx.clearCart();
    if (typeof ctx.dispatch === "function") return ctx.dispatch({ type: "CLEAR" });
  };

  // --- UI ---

  if (lines.length === 0) {
    return (
      <div className="container" style={{ padding: "2rem 1rem" }}>
        <h2>Your Cart</h2>
        <p className="muted">Your cart is empty.</p>
        <Link className="btn primary" to="/products">Browse products</Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: "1.5rem 1rem 2.5rem" }}>
      <h2 style={{ marginBottom: "1rem" }}>Your Cart</h2>

      <div className="card" style={{ padding: "1rem" }}>
        {lines.map((l) => (
          <div
            key={l.id}
            className="row"
            style={{
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              padding: ".6rem 0",
              borderBottom: "1px solid #eee",
            }}
          >
            <div className="row" style={{ alignItems: "center", gap: 12 }}>
              {l.image && (
                <img
                  src={l.image}
                  alt={l.name}
                  style={{ width: 64, height: 64, objectFit: "cover", borderRadius: 8 }}
                />
              )}
              <div>
                <div style={{ fontWeight: 600 }}>{l.name}</div>
                <div className="muted">${l.price.toFixed(2)} / {l.unit}</div>
              </div>
            </div>

            <div className="row" style={{ gap: 10, alignItems: "center" }}>
              <div className="qty">
                <button onClick={() => setQty(l, Math.max(1, l.qty - 1))} aria-label="Decrease">−</button>
                <input readOnly value={l.qty} />
                <button onClick={() => setQty(l, Math.min(99, l.qty + 1))} aria-label="Increase">+</button>
              </div>

              <div style={{ width: 88, textAlign: "right", fontWeight: 700 }}>
                ${l.total.toFixed(2)}
              </div>

              <button className="btn" onClick={() => removeLine(l)} aria-label={`Remove ${l.name}`}>
                Remove
              </button>
            </div>
          </div>
        ))}

        <div className="row" style={{ justifyContent: "space-between", paddingTop: "1rem" }}>
          <div className="muted">Items: {linesCount(lines)}</div>
          <div style={{ fontWeight: 800, fontSize: 18 }}>Subtotal: ${subtotal.toFixed(2)}</div>
        </div>

        <div className="row" style={{ gap: 12, marginTop: 12, justifyContent: "flex-end" }}>
          <button className="btn" onClick={clearCart}>Clear cart</button>
          <button className="btn primary" onClick={() => navigate("/checkout")}>
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
