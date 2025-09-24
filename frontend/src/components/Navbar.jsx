import React from "react";
import { Link, NavLink } from "react-router-dom";
import { useUser } from "../store/userContext.jsx";
import { useCart } from "../store/cartContext.jsx";
import "../styles.css"; // make sure styles.css is imported so media query applies

export default function Navbar() {
  const { user, logout } = useUser();

  let count = 0;
  try {
    const cartCtx = useCart();
    count =
      cartCtx?.count ??
      (Array.isArray(cartCtx?.cart)
        ? cartCtx.cart.reduce((n, i) => n + (Number(i.quantity) || 0), 0)
        : 0);
  } catch {
    count = 0;
  }

  return (
    <>
      <div className="dev-banner">
        🚧 Work Zone — This site is still under development
      </div>
      <header>
        <div className="nav container">
          {/* Logo + Text together */}
          <Link to="/" className="logo-link">
            <img src="/images/new vsfoods.jpg" alt="VS Foods Logo" className="logo-img" />
            <span className="logo-text">VS Foods</span>
          </Link>

          <nav className="row" style={{ gap: 16, alignItems: "center" }}>
            <NavLink to="/products">Products</NavLink>
            <NavLink to="/contact">Contact</NavLink>

            {user ? (
              <div className="row" style={{ gap: 8, alignItems: "center" }}>
                <span className="muted">Hi, {user.firstName || "Customer"}</span>
                <button className="btn" onClick={logout}>
                  Logout
                </button>
              </div>
            ) : (
              <>
                <NavLink to="/login">Login</NavLink>
                <NavLink to="/signup">Signup</NavLink>
              </>
            )}

            <Link to="/cart" className="cart-link" aria-label="Cart">
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
