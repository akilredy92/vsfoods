import React from "react";

export default function FeatureStrip() {
  const items = [
    { title: "Small-batch", sub: "Freshly prepared" },
    { title: "Quality Oils", sub: "Cold-pressed" },
    { title: "Local Delivery", sub: "Fast & reliable" },
    { title: "Traditional", sub: "Family recipes" },
  ];
  return (
    <div className="card" style={{ padding: "1rem" }}>
      <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))" }}>
        {items.map(i => (
          <div key={i.title} style={{ textAlign: "center", padding: ".6rem 0" }}>
            <div style={{ fontWeight: 700 }}>{i.title}</div>
            <div className="muted">{i.sub}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

