import React from "react";
import { Link } from "react-router-dom";

const links = [
  { to: "#sweets", label: "Sweets" },
  { to: "#hot", label: "Hot Ones" },
  { to: "#evening", label: "Evening Snacks" },
  { to: "#pickles-veg", label: "Pickles — Veg" },
  { to: "#pickles-nonveg", label: "Pickles — Non-Veg" },
];

export default function SectionNav() {
  return (
    <div style={{
      position: "sticky", top: 64, zIndex: 5,
      marginTop: "1rem", padding: "0.5rem",
      borderRadius: 12, backdropFilter: "blur(6px)",
      background: "rgba(255,255,255,0.75)", border: "1px solid #eee"
    }}>
      <div className="row" style={{ flexWrap: "wrap", gap: "0.6rem" }}>
        {links.map(l => (
          <a key={l.to} href={l.to} className="badge" style={{ cursor: "pointer" }}>
            {l.label}
          </a>
        ))}
      </div>
    </div>
  );
}
