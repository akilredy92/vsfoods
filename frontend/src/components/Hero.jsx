import React from "react";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section style={{
      position: "relative",
      borderRadius: 16,
      overflow: "hidden",
      minHeight: 360,
      display: "grid",
      placeItems: "center",
      textAlign: "center",
      boxShadow: "var(--shadow)"
    }}>
      <img
        src="/images/hero.jpg"
        alt="VS Foods hero"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.65)" }}
      />
      <div style={{ position: "relative", padding: "3rem 1rem", color: "#fff" }}>
        <h1 style={{ fontSize: "clamp(2rem,4vw,3rem)", margin: 0 }}>Taste of Home, Made Fresh</h1>
        <p style={{ marginTop: 10, opacity: .95, fontSize: 18 }}>
          Preservative-free snacks & pickles crafted in small batches.
        </p>
        <div className="row" style={{ justifyContent: "center", marginTop: 16 }}>
          <Link className="btn primary" to="/products">Shop Products</Link>
          <Link className="btn secondary" to="/contact">Contact Us</Link>
        </div>
      </div>
    </section>
  );
}

