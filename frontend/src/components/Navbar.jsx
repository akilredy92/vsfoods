import React from "react";
import { Link, NavLink } from "react-router-dom";
import useCart from "../store/cart";

export default function Navbar() {
  const items = useCart((s) => s.items);
  const count = items.reduce((n, i) => n + i.quantity, 0);

  return (
    <header>
      <div className="nav container">
        <Link to="/" style={{ fontWeight: 800, fontSize: 20 }}>VS Foods</Link>
        <nav className="row" style={{ gap: "1.2rem" }}>
          <NavLink to="/products" className={({ isActive }) => (isActive ? "muted" : "")}>
            Products
          </NavLink>

          {/* Cart link with custom image */}
          <NavLink to="/cart" className="row" style={{ position: "relative" }}>
            <img
              src="/images/cart-icon.png"
              alt="Cart"
              style={{ width: 24, height: 24 }}
            />
            {count > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: -6,
                  right: -10,
                  background: "var(--brand-2)",
                  color: "white",
                  borderRadius: "50%",
                  padding: "2px 6px",
                  fontSize: "0.7rem",
                  fontWeight: "bold"
                }}
              >
                {count}
              </span>
            )}
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
