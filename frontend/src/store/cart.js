import { create } from "zustand";

const useCart = create((set, get) => ({
  items: [],

  // Add or increase quantity
  add: (item) =>
    set((state) => {
      const idx = state.items.findIndex((i) => i.id === item.id);
      if (idx >= 0) {
        const copy = state.items.slice();
        copy[idx] = {
          ...copy[idx],
          quantity: Number(copy[idx].quantity || 0) + Number(item.quantity || 1),
        };
        return { items: copy };
      }
      return { items: [...state.items, { ...item, quantity: Number(item.quantity || 1) }] };
    }),

  // Optional helpers
  inc: (id) =>
    set((state) => ({
      items: state.items.map((i) => (i.id === id ? { ...i, quantity: i.quantity + 1 } : i)),
    })),
  dec: (id) =>
    set((state) => ({
      items: state.items.map((i) =>
        i.id === id ? { ...i, quantity: Math.max(1, i.quantity - 1) } : i
      ),
    })),
  remove: (id) => set((state) => ({ items: state.items.filter((i) => i.id !== id) })),

  // Derived selectors
  count: () => get().items.reduce((n, i) => n + (Number(i.quantity) || 0), 0),
  subtotal: () => get().items.reduce((s, i) => s + Number(i.price) * Number(i.quantity || 0), 0),
}));

export default useCart;
