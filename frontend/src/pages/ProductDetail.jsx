//cat > frontend/src/pages/ProductDetail.jsx <<'EOF'
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProduct } from "../api/client";
import useCart from "../store/cart";
import QuantitySelector from "../components/QuantitySelector";

export default function ProductDetail() {
  const { id } = useParams();
  const [p, setP] = useState(null);
  const [qty, setQty] = useState(1);
  const addItem = useCart(s => s.addItem);

  useEffect(() => {
    getProduct(id).then(setP).catch(console.error);
  }, [id]);

  if (!p) return <div className="container">Loading...</div>;

  return (
    <div className="container" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
      <img src={p.image} alt={p.name} style={{ width: "100%", borderRadius: 16 }} />
      <div>
        <h2 style={{ marginTop: 0 }}>{p.name}</h2>
        <div className="muted">{p.category} • ⭐ {p.rating}</div>
        <p style={{ marginTop: 12 }}>{p.description}</p>
        <div className="row" style={{ justifyContent: "space-between", marginTop: 12 }}>
          <span className="price">${p.price.toFixed(2)}</span>
          <QuantitySelector value={qty} onChange={setQty} />
        </div>
        <div style={{ marginTop: 16 }}>
          <button
            className="btn primary"
            onClick={() => addItem({ id: p.id, name: p.name, price: p.price, image: p.image, quantity: qty })}
          >
            Add to cart
          </button>
        </div>
      </div>
    </div>
  );
}
