import React, { useEffect, useState } from "react";
import { getProducts } from "../api/client";
import ProductCard from "../components/ProductCard";

export default function Products() {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");

  useEffect(() => {
    getProducts().then(setItems).catch(console.error);
  }, []);

  const cats = ["All", ...Array.from(new Set(items.map(i => i.category)))];
  const filtered = items.filter(
    i => (cat === "All" || i.category === cat) && i.name.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="container">
      <div className="row" style={{ justifyContent: "space-between", marginBottom: 16 }}>
        <input
          placeholder="Search products..."
          value={q}
          onChange={e => setQ(e.target.value)}
          style={{ padding: "0.6rem 0.8rem", borderRadius: 10, border: "1px solid #ddd", width: "60%" }}
        />
        <select value={cat} onChange={e => setCat(e.target.value)} className="btn">
          {cats.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div className="grid grid-4">
        {filtered.map(p => <ProductCard key={p.id} product={p} />)}
      </div>
    </div>
  );
}

