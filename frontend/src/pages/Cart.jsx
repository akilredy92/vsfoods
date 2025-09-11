//cat > frontend/src/pages/Cart.jsx <<'EOF'
import React from "react";
import { Link } from "react-router-dom";
import useCart from "../store/cart";

export default function Cart() {
  const items = useCart(s => s.items);
  const updateQty = useCart(s => s.updateQty);
  const removeItem = useCart(s => s.removeItem);
  const total = useCart(s => s.total)();

  if (!items.length) {
    return (
      <div className="container">
        <p>Your cart is empty.</p>
        <Link className="btn primary" to="/products">Shop products</Link>
      </div>
    );
  }

  return (
    <div className="container">
      <h2>Cart</h2>
      <div style={{ display: "grid", gap: "1rem" }}>
        {items.map(i => (
          <div key={i.id} className="card" style={{ display: "grid", gridTemplateColumns: "80px 1fr auto", gap: "1rem", alignItems: "center" }}>
            <img src={i.image} alt={i.name} style={{ width: 80, height: 80, objectFit: "cover" }} />
            <div className="card-body">
              <div className="row" style={{ justifyContent: "space-between" }}>
                <strong>{i.name}</strong>
                <span>${(i.price * i.quantity).toFixed(2)}</span>
              </div>
              <div className="row" style={{ marginTop: 8 }}>
                <button className="btn" onClick={() => updateQty(i.id, i.quantity - 1)}>−</button>
                <span>{i.quantity}</span>
                <button className="btn" onClick={() => updateQty(i.id, i.quantity + 1)}>+</button>
                <button className="btn" onClick={() => removeItem(i.id)} style={{ marginLeft: "auto" }}>Remove</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row" style={{ justifyContent: "space-between", marginTop: 16 }}>
        <strong>Total: ${total.toFixed(2)}</strong>
        <Link className="btn primary" to="/checkout">Checkout</Link>
      </div>
    </div>
  );
}

