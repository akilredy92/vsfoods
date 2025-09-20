import React from "react";
import { Link, NavLink } from "react-router-dom";
import useCart from "../store/cart";

export default function Navbar() {
  const items = useCart((s) => s.items);
  const count = items.reduce((n, i) => n + (Number(i.quantity) || 0), 0);

  return (
    <>
      {/* Development Banner */}
      <div className="dev-banner">
        🚧 Work Zone — This site is still under development
      </div>

      <header>
        <div className="nav container">
          <Link to="/" style={{ fontWeight: 800, fontSize: 22 }}>VS Foods</Link>

          <nav className="row" style={{ gap: 16 }}>
            <NavLink to="/products">Products</NavLink>
            <NavLink to="/contact">WhatsApp us</NavLink>
            <NavLink to="/login">Login</NavLink>

            <Link to="/cart" className="cart-link" aria-label="Cart">
              {/* Inline SVG so icon never 404s */}
              <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
                <path
                  d="M7 4H5L4 6v1h2l3.6 7.59-1.35 2.44A1 1 0 0 0 9.1 19H19v-2H9.42l.93-1.68H17a1 1 0 0 0 .92-.62L21 8H6.21L5.27 6H7V4Zm2.5 15a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Zm8 0a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Z"
                  fill="currentColor"
                />
              </svg>
              {count > 0 && <span className="cart-badge">{count}</span>}
            </Link>
          </nav>
        </div>
      </header>
    </>
  );
}
