import React from "react";
import { useParams } from "react-router-dom";
import { getProduct } from "../api/client";
import useCart from "../store/cart";

export default function ProductDetail() {
  const { id } = useParams();
  const add = useCart((s) => s.add);
  const [product, setProduct] = React.useState(null);
  const [qty, setQty] = React.useState(1);
  const [err, setErr] = React.useState("");

  React.useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const p = await getProduct(id);
        if (alive) setProduct(p);
      } catch (e) {
        setErr("Product not found.");
      }
    })();
    return () => (alive = false);
  }, [id]);

  if (err) return <div className="container">{err}</div>;
  if (!product) return <div className="container">Loading…</div>;

  const total = (Number(product.price) * qty).toFixed(2);

  return (
    <div className="container" style={{ display: "grid", gap: "1.5rem", gridTemplateColumns: "1fr 1fr" }}>
      <div className="card" style={{ overflow: "hidden" }}>
        <img
          src={product.image}
          alt={product.name}
          onError={(e) => (e.currentTarget.src = "/images/placeholder.jpg")}
          style={{ width: "100%", height: 420, objectFit: "cover" }}
        />
      </div>

      <div>
        <h1 style={{ marginTop: 0 }}>{product.name}</h1>
        <p className="muted" style={{ marginTop: -6 }}>{product.category}</p>

        <p className="price" style={{ fontSize: 22, marginTop: 10 }}>
          ${Number(product.price).toFixed(2)}/{product.unit || "lb"}
        </p>

        <p style={{ marginTop: 12 }}>{product.description}</p>

        <div className="row" style={{ gap: 12, margin: "12px 0" }}>
          <div className="qty">
            <button onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
            <input value={qty} readOnly />
            <button onClick={() => setQty((q) => q + 1)}>+</button>
          </div>
           <button
              className="btn primary"
              onClick={() =>
                add({
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  unit: product.unit,
                  image: product.image,
                  quantity: qty,          // ✅ add the selected qty
                })
              }
            >
              Add to cart
            </button>
          </div>
      </div>
    </div>
  );
}
