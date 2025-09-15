// cat > frontend/src/components/Section.jsx <<'EOF'
import React from "react";
import ProductCard from "./ProductCard";

/** Generic product section with a title and grid of cards.
 * items: [{ id, name, price, image, category }]
 */
export default function Section({ id, title, items = [] }) {
  return (
    <section id={id} style={{ marginTop: "2rem" }}>
      <h2 style={{ margin: 0 }}>{title}</h2>
      <div className="grid grid-4" style={{ marginTop: "1rem" }}>
        {items.map(p => <ProductCard key={p.id} product={p} />)}
      </div>
    </section>
  );
}
