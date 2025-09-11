import React from "react";

export default function Footer() {
  return (
    <footer>
      <div className="container">
        © {new Date().getFullYear()} VS Foods · Fresh. Homemade. Local.
      </div>
    </footer>
  );
}
