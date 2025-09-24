import React, { useState } from "react";

export default function Payment() {
  const [method, setMethod] = useState("card");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Payment submitted using ${method}`);
  };

  return (
    <div className="container" style={{ maxWidth: 600, marginTop: "2rem" }}>
      <h2>Payment</h2>
      <form
        onSubmit={handleSubmit}
        className="card"
        style={{ padding: "1.5rem", display: "grid", gap: "1rem" }}
      >
        {/* Credit / Debit Card */}
        <label>
          <input
            type="radio"
            name="payment"
            value="card"
            checked={method === "card"}
            onChange={(e) => setMethod(e.target.value)}
          />{" "}
          Credit / Debit Card
        </label>

        {/* UPI */}
        <label>
          <input
            type="radio"
            name="payment"
            value="upi"
            checked={method === "upi"}
            onChange={(e) => setMethod(e.target.value)}
          />{" "}
          UPI (Google Pay / PhonePe / Paytm)
        </label>

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

        <button className="btn primary" style={{ marginTop: "1rem" }}>
          Pay Now
        </button>
      </form>
    </div>
  );
}
