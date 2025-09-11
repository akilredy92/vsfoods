// frontend/src/pages/Home.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="container">
      {/* Hero */}
      <section className="hero">
        <div>
          <div className="badges">
            <span className="badge">Homemade</span>
            <span className="badge">Small-batch</span>
            <span className="badge">Preservative-free</span>
          </div>

          <h1>Fresh homemade snacks & pickles — delivered locally</h1>

          <p className="muted" style={{ fontSize: 18, marginTop: 10 }}>
            Crafted in New Jersey with quality ingredients. Taste that reminds you of home.
          </p>

          <div style={{ marginTop: 16, display: "flex", gap: "10px" }}>
            <Link className="btn primary" to="/products">Shop now</Link>
            <Link className="btn secondary" to="/contact">Contact us</Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ marginTop: "2rem" }}>
        <div className="feature-grid">
          <div className="feature">
            <h3>Quality ingredients</h3>
            <p className="muted">Hand-picked spices and oils for consistent, rich flavor.</p>
          </div>
          <div className="feature">
            <h3>Local delivery</h3>
            <p className="muted">Fast delivery across NJ. Pickup available on request.</p>
          </div>
          <div className="feature">
            <h3>Family recipes</h3>
            <p className="muted">Time-tested recipes that feel like home.</p>
          </div>
          <div className="feature">
            <h3>Made to order</h3>
            <p className="muted">Small batches. No artificial preservatives.</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ marginTop: "2rem", textAlign: "center" }}>
        <h2>Ready to order?</h2>
        <p className="muted">Browse our bestsellers or reach out for bulk/party orders.</p>
        <div style={{ marginTop: 12 }}>
          <Link className="btn primary" to="/products">Browse products</Link>
        </div>
      </section>
    </div>
  );
}
