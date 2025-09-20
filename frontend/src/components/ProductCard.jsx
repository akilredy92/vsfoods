import React from "react";
import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  return (
    <div className="card">
      <Link to={`/products/${product.id}`}>
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          onError={(e) => (e.currentTarget.src = "/images/placeholder.jpg")}
          style={{ width: "100%", height: 200, objectFit: "cover" }}
        />
      </Link>

      <div className="card-body">
        <h3 style={{ margin: 0 }}>{product.name}</h3>
        <p className="muted" style={{ margin: 0 }}>{product.category}</p>

        <div className="card-footer">
          <span className="price">
            ${Number(product.price).toFixed(2)}/{product.unit || "lb"}
          </span>

          {/* View button navigates to detail too */}
          <Link className="btn secondary" to={`/products/${product.id}`}>
            View
          </Link>
        </div>
      </div>
    </div>
  );
}
