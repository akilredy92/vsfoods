//cat > frontend/src/pages/NotFound.jsx <<'EOF'
import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="container">
      <h2>404 — Not Found</h2>
      <Link className="btn primary" to="/">Go home</Link>
    </div>
  );
}

