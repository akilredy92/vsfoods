import React from "react";
import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  const slug = product.slug || product.id;
  return (
    <div style={{ width: 248 }}>
      <Link to={`/products/${encodeURIComponent(slug)}`}>
        <img
          src={product.image}
          alt={product.name}
          style={{ width: "100%", height: 180, objectFit: "cover", borderRadius: 12 }}
        />
        <div style={{ padding: "8px 2px" }}>
          <div style={{ fontWeight: 700 }}>{product.name}</div>
          <div style={{ color: "#111827" }}>${Number(product.price).toFixed(2)}</div>
        </div>
      </Link>
    </div>
  );
}
