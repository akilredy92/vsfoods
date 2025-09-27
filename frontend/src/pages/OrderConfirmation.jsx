import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function OrderConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState(null);

  useEffect(() => {
    // 1. Try to read order data from state (preferred)
    if (location.state?.order) {
      setOrderData(location.state.order);
      return;
    }

    // 2. Fallback to localStorage (if user refreshes confirmation page)
    try {
      const saved = JSON.parse(localStorage.getItem("vsf_last_order") || "null");
      if (saved) {
        setOrderData(saved);
      }
    } catch {
      console.warn("No order data found.");
    }
  }, [location.state]);

  if (!orderData) {
    return (
      <div className="container" style={{ maxWidth: 600, marginTop: "2rem" }}>
        <h2>No Order Found</h2>
        <p className="muted">It looks like you haven’t placed an order yet.</p>
        <button className="btn primary" onClick={() => navigate("/products")}>
          Back to Products
        </button>
      </div>
    );
  }

  return (
    <div className="container" style={{ maxWidth: 600, marginTop: "2rem" }}>
      <div
        className="card"
        style={{
          padding: "1.5rem",
          textAlign: "center",
          borderRadius: 16,
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        }}
      >
        <h2>🎉 Thank You for Your Order!</h2>
        <p>Your order has been successfully placed.</p>

        <div
          style={{
            padding: "1rem",
            background: "#ecfdf5",
            color: "#065f46",
            borderRadius: "8px",
            fontWeight: 600,
            marginTop: "1rem",
          }}
        >
          Order ID: {orderData.orderId}
        </div>

        <div style={{ marginTop: "1.5rem", textAlign: "left" }}>
          <h3>Order Details</h3>
          <ul style={{ paddingLeft: "1.2rem" }}>
            {orderData.items?.map((it, i) => (
              <li key={i}>
                {it.quantity} × {it.name}
              </li>
            ))}
          </ul>
          <p>
            <strong>Payment Method:</strong> {orderData.paymentMethod}
          </p>
          <p>
            <strong>Needed By:</strong> {orderData.dateNeededBy}
          </p>
        </div>

        <div style={{ marginTop: "2rem" }}>
          <Link className="btn primary" to="/products">
            ← Back to Products
          </Link>
        </div>
      </div>
    </div>
  );
}
