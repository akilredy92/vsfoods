import React, { useState } from "react";

export default function Payment() {
  const [method, setMethod] = useState("card");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (method === "zelle") {
      alert("Please complete your payment using Zelle: Send to vsfoods@gmail.com or (555) 123-4567");
    } else {
      alert(`Payment submitted using ${method}`);
    }
  };

  return (
    <div className="container" style={{ maxWidth: 600, marginTop: "2rem" }}>
      <h2>Payment</h2>
      <form
        onSubmit={handleSubmit}
        className="card"
        style={{ padding: "1.5rem", display: "grid", gap: "1rem" }}
      >

        {/* Zelle */}
        <label>
          <input
            type="radio"
            name="payment"
            value="zelle"
            checked={method === "zelle"}
            onChange={(e) => setMethod(e.target.value)}
          />{" "}
          Zelle (US Bank Transfer)
        </label>

        {/* Show Zelle Instructions */}
        {method === "zelle" && (
          <div style={{ padding: "0.8rem", background: "#fef9c3", borderRadius: "8px" }}>
            <strong>Zelle Instructions:</strong>
            <p style={{ margin: "0.5rem 0" }}>
              Please send your payment to:
            </p>
            <ul style={{ margin: 0, paddingLeft: "1.2rem" }}>
              <li>Email: <b>vsfoods@gmail.com</b></li>
              <li>Phone: <b>(555) 123-4567</b></li>
            </ul>
            <p style={{ fontSize: "0.9rem", marginTop: "0.5rem", color: "#6b7280" }}>
              ⚠️ Make sure to include your Order ID in the note while sending payment.
            </p>
          </div>
        )}

        {/* COD */}
        <label>
          <input
            type="radio"
            name="payment"
            value="cod"
            checked={method === "cod"}
            onChange={(e) => setMethod(e.target.value)}
          />{" "}
          Cash on Delivery
        </label>

        <button className="btn primary" style={{ marginTop: "1rem" }}>
          Pay Now
        </button>
      </form>
    </div>
  );
}
