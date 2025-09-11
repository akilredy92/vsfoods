import { create } from "zustand";

const useCartStore = create((set, get) => ({
  items: [], // {id, name, price, image, quantity}
  addItem: (item) => {
    const exists = get().items.find(i => i.id === item.id);
    if (exists) {
      set({
        items: get().items.map(i =>
          i.id === item.id ? { ...i, quantity: i.quantity + (item.quantity || 1) } : i
        )
      });
    } else {
      set({ items: [...get().items, { ...item, quantity: item.quantity || 1 }] });
    }
  },
  removeItem: (id) => set({ items: get().items.filter(i => i.id !== id) }),
  updateQty: (id, qty) => {
    if (qty <= 0) return set({ items: get().items.filter(i => i.id !== id) });
    set({ items: get().items.map(i => i.id === id ? { ...i, quantity: qty } : i) });
  },
  clear: () => set({ items: [] }),
  total: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0)
}));

export default useCartStore;