import React from "react";
import { Link } from "react-router-dom";

export default function CategoryCard({ title, img, to="/products" }) {
  return (
    <Link to={to} className="card" style={{ overflow: "hidden" }}>
      <img src={img} alt={title} />
      <div className="card-body">
        <h3 style={{ margin: 0 }}>{title}</h3>
        <p className="muted" style={{ marginTop: 6 }}>Explore {title.toLowerCase()}</p>
      </div>
    </Link>
  );
}

