import React from "react";

export default function TestimonialCard({ quote, name, place }) {
  return (
    <div className="card" style={{ padding: "1rem" }}>
      <p style={{ margin: 0, fontStyle: "italic" }}>"{quote}"</p>
      <div className="muted" style={{ marginTop: 8 }}>— {name}{place ? ` • ${place}` : ""}</div>
    </div>
  );
}

