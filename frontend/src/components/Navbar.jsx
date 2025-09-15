import React from "react";
import { Link, NavLink } from "react-router-dom";
import useCart from "../store/cart";
import useAuth from "../store/auth";

const WHATSAPP_NUMBER = "919876543210"; // your number
const PREFILL = "Hi VS Foods, I want to place an order.";
const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(PREFILL)}`;

export default function Navbar() {
  const items = useCart(s => s.items);
  const count = items.reduce((n, i) => n + i.quantity, 0);

  const { user, logout } = useAuth();

  return (
    <header>
      <div className="nav container">
        <Link to="/" style={{ fontWeight: 800, fontSize: 20 }}>VS Foods</Link>

        <nav className="row" style={{ gap: "1.4rem" }}>
          <NavLink to="/products">Products</NavLink>
          <a href={waUrl} target="_blank" rel="noopener noreferrer" className="nav-cta">WhatsApp us</a>

          {!user ? (
            <NavLink to="/login" className="nav-cta">Login</NavLink>
          ) : (
            <div className="row" style={{ gap: ".6rem", alignItems: "center" }}>
              <span className="muted">Hi, {user.email}</span>
              <button className="btn secondary" onClick={logout}>Logout</button>
            </div>
          )}

          <NavLink to="/cart" className="row" style={{ position: "relative" }}>
            <img src="/images/cart-icon.png" alt="Cart" style={{ width: 24, height: 24 }} />
            {count > 0 && (
              <span style={{
                position: "absolute", top: -6, right: -10,
                background: "var(--brand-2)", color: "#fff",
                borderRadius: "50%", padding: "2px 6px", fontSize: ".7rem", fontWeight: "bold"
              }}>
                {count}
              </span>
            )}
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
