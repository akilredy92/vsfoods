// src/pages/Checkout.jsx
import React, { useState } from "react";
import { useCart } from "../store/cartContext";
import { useUser } from "../store/userContext";
import { Link } from "react-router-dom";

export default function Checkout() {
  const { cart, clearCart } = useCart();
  const { user } = useUser();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    email: "",
    phone: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Order placed successfully!");
    clearCart();
  };

  return (
    <div className="container" style={{ maxWidth: "600px", margin: "2rem auto" }}>
      {/* Greeting if user is logged in */}
      {user ? (
        <p style={{ fontWeight: 600, marginBottom: "1rem" }}>
          Hi {user.firstName || "there"}!
        </p>
      ) : (
        <div
          style={{
            background: "#fff7d6",
            padding: "1rem",
            borderRadius: "8px",
            marginBottom: "1rem",
            border: "1px solid #facc15"
          }}
        >
          <strong>Register & get 5% off!</strong>
          <p style={{ margin: "0.25rem 0 0" }}>
            Create a free account and your order gets an instant discount.
          </p>
          <div style={{ marginTop: "0.5rem", display: "flex", gap: "0.5rem" }}>
            <Link to="/signup" className="btn primary">
              Register
            </Link>
            <Link to="/login" className="btn secondary">
              Login
            </Link>
          </div>
        </div>
      )}

      {/* Checkout Form */}
      <form onSubmit={handleSubmit} className="card" style={{ padding: "1.5rem" }}>
        <h2 style={{ marginBottom: "1rem" }}>Checkout</h2>

        {!user && (
          <>
            <div className="row">
              <input
                name="firstName"
                placeholder="First Name"
                value={form.firstName}
                onChange={handleChange}
                required
              />
              <input
                name="lastName"
                placeholder="Last Name"
                value={form.lastName}
                onChange={handleChange}
                required
              />
            </div>
          </>
        )}

        {user && (
          <>
            <div className="row">
              <input
                name="firstName"
                placeholder="First Name"
                value={form.firstName}
                onChange={handleChange}
                required
              />
              <input
                name="lastName"
                placeholder="Last Name"
                value={form.lastName}
                onChange={handleChange}
                required
              />
            </div>
          </>
        )}

        <input
          name="street"
          placeholder="Street Address"
          value={form.street}
          onChange={handleChange}
          required
        />
        <input
          name="city"
          placeholder="City"
          value={form.city}
          onChange={handleChange}
          required
        />
        <div className="row">
          <input
            name="state"
            placeholder="State"
            value={form.state}
            onChange={handleChange}
            required
          />
          <input
            name="zip"
            placeholder="Zipcode"
            value={form.zip}
            onChange={handleChange}
            required
          />
        </div>

        <div className="row">
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
          />
          <input
            name="phone"
            type="tel"
            placeholder="Phone"
            value={form.phone}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="btn primary" style={{ marginTop: "1rem" }}>
          Place Order
        </button>
      </form>
    </div>
  );
}
