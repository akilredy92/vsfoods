// src/store/cartContext.jsx
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext(null);
const LS_KEY = "vsfoods_cart_v1";

export function CartProvider({ children }) {
  const [items, setItems] = useState([]); // each: {id, name, price, quantity, image, unit}

  // load from localStorage once
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
  }, []);

  // persist on change
  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(items));
    } catch {}
  }, [items]);

  const addItem = (item, qty = 1) => {
    if (!item?.id) return;
    setItems(prev => {
      const i = prev.findIndex(p => p.id === item.id);
      if (i >= 0) {
        const next = [...prev];
        next[i] = { ...next[i], quantity: next[i].quantity + qty };
        return next;
      }
      return [...prev, { ...item, quantity: qty }];
    });
  };

  const updateQty = (id, qty) => {
    setItems(prev => prev.map(p => (p.id === id ? { ...p, quantity: Math.max(1, qty) } : p)));
  };

  const removeItem = (id) => setItems(prev => prev.filter(p => p.id !== id));
  const clear = () => setItems([]);

  // derived
  const count = useMemo(() => items.reduce((n, i) => n + (Number(i.quantity) || 0), 0), [items]);

  // keep legacy field name "cart" so old code keeps working
  const value = { cart: items, items, count, addItem, updateQty, removeItem, clear };
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
