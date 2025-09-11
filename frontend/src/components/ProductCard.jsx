// cat > frontend/src/components/ProductCard.jsx <<'EOF'
import React from "react";
import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  return (
    <div className="card">
      <img src={product.image} alt={product.name} loading="lazy" />
      <div className="card-body">
        <h3 style={{ margin: "0 0 6px 0" }}>{product.name}</h3>
        <div className="row" style={{ justifyContent: "space-between" }}>
          <span className="muted">{product.category}</span>
          <span className="price">${product.price.toFixed(2)}</span>
        </div>
        <div style={{ marginTop: 8 }}>
          <Link className="btn secondary" to={`/products/${product.id}`}>
            View
          </Link>
        </div>
      </div>
    </div>
  );
}

