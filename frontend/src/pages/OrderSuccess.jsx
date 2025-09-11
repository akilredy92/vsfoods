//cat > frontend/src/pages/OrderSuccess.jsx <<'EOF'
import React from "react";
import { useParams, Link } from "react-router-dom";

export default function OrderSuccess() {
  const { orderId } = useParams();
  return (
    <div className="container">
      <h2>Thank you!</h2>
      <p>Your order <strong>{orderId}</strong> was placed successfully.</p>
      <Link className="btn primary" to="/products">Continue shopping</Link>
    </div>
  );
}

