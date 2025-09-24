import React, { createContext, useContext, useEffect, useMemo, useReducer } from "react";

const CartContext = createContext(null);

function load() {
  try { return JSON.parse(localStorage.getItem("vsfoods_cart") || "[]"); }
  catch { return []; }
}
function save(state) {
  try { localStorage.setItem("vsfoods_cart", JSON.stringify(state)); } catch {}
}

function keyFrom(p) {
  // robust key (id preferred; fallback to slug or name)
  return String(p.id ?? p.slug ?? p.name ?? "").trim();
}

function reducer(state, action) {
  switch (action.type) {
    case "ADD": {
      const { product, qty } = action.payload;
      const key = keyFrom(product);
      const idx = state.findIndex(i => i.key === key);
      if (idx >= 0) {
        const next = [...state];
        next[idx] = { ...next[idx], quantity: Math.min(99, (next[idx].quantity || 0) + (qty || 1)) };
        return next;
      }
      return [
        ...state,
        {
          key,
          id: product.id ?? product.slug ?? product.name,
          name: product.name,
          price: Number(product.price || 0),
          image: product.image,
          quantity: Math.max(1, qty || 1),
          unit: product.unit || "lb",
          raw: product,
        },
      ];
    }
    case "REMOVE": {
      return state.filter(i => i.key !== action.payload.key);
    }
    case "SET_QTY": {
      const { key, qty } = action.payload;
      return state.map(i => (i.key === key ? { ...i, quantity: Math.max(1, Math.min(99, qty)) } : i));
    }
    case "CLEAR":
      return [];
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [cart, dispatch] = useReducer(reducer, [], load);

  useEffect(() => { save(cart); }, [cart]);

  const count = useMemo(() => cart.reduce((n, i) => n + (Number(i.quantity) || 0), 0), [cart]);
  const subtotal = useMemo(
    () => cart.reduce((s, i) => s + Number(i.price || 0) * Number(i.quantity || 0), 0),
    [cart]
  );

  const addToCart = (product, qty = 1) => dispatch({ type: "ADD", payload: { product, qty } });
  const removeFromCart = key => dispatch({ type: "REMOVE", payload: { key } });
  const setQty = (key, qty) => dispatch({ type: "SET_QTY", payload: { key, qty } });
  const clearCart = () => dispatch({ type: "CLEAR" });

  const value = { cart, count, subtotal, addToCart, removeFromCart, setQty, clearCart, dispatch };
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
