import React from "react";
import { Link } from "react-router-dom";

function Card({ item }) {
  const slug = item.slug || item.id;
  return (
    <div
      className="product-card"
      style={{
        width: 248,                 // ⬆️ slightly bigger
        borderRadius: 16,
        overflow: "hidden",
        background: "#fff",
        border: "1px solid #eee",
        boxShadow: "0 2px 10px rgba(0,0,0,.06)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {item.image && (
        <img
          src={item.image}
          alt={item.name}
          style={{ width: "100%", height: 180, objectFit: "cover" }} // ⬆️ taller image
        />
      )}

      <div style={{ padding: "10px 14px 0 14px", flex: 1 }}>
        <h3 style={{ margin: 0, fontSize: "1.06rem", lineHeight: 1.25 }}>
          {item.name}
        </h3>

        {/* ❌ Removed the category/subtitle line entirely */}
      </div>

      {/* price + view (tighter, not at the edges) */}
      <div
        style={{
          padding: "10px 14px 12px 14px",   // ⬇️ tighter than before
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderTop: "1px solid #eee",
          marginTop: 8,
        }}
      >
        <div style={{ fontWeight: 700, fontSize: "1rem" }}>
          ${Number(item.price).toFixed(2)}
        </div>
        <Link
          to={`/products/${encodeURIComponent(slug)}`}
          className="btn"
          style={{
            padding: ".45rem .9rem",
            borderRadius: 10,
            border: "1px solid #ddd",
            fontWeight: 600,
          }}
        >
          View
        </Link>
      </div>
    </div>
  );
}

export default function Section({ id, title, items }) {
  return (
    <section id={id} style={{ marginTop: "1.6rem" }}>
      <div
        className="container"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          marginBottom: 10,
        }}
      >
        <h2 style={{ margin: 0 }}>{title}</h2>
        <Link to="/products" className="muted" style={{ textDecoration: "underline" }}>
          View all
        </Link>
      </div>

      {/* horizontal scroller */}
      <div
        className="container"
        style={{
          display: "flex",
          gap: 14,
          overflowX: "auto",
          paddingBottom: 8,
          scrollSnapType: "x proximity",
        }}
      >
        {items.map((it) => (
          <div key={it.id} style={{ scrollSnapAlign: "start" }}>
            <Card item={it} />
          </div>
        ))}
      </div>
    </section>
  );
}
