import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { listProducts } from "../api/client";
import { useCart } from "../store/cartContext";

const slugify = (s = "") =>
  String(s).toLowerCase().trim().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();            // ✅ expect this to exist now

  const [product, setProduct] = useState(null);
  const [err, setErr] = useState("");
  const [qty, setQty] = useState(1);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const items = await listProducts();
        let found =
          items.find(p => (p.slug || slugify(p.id || p.name)) === slug) ||
          items.find(p => (p.slug || slugify(p.id || p.name)) === slugify(decodeURIComponent(slug || ""))) ||
          items.find(p => String(p.id || "").toLowerCase() === decodeURIComponent(slug || "").toLowerCase()) ||
          items.find(p => String(p.name || "").toLowerCase() === decodeURIComponent(slug || "").toLowerCase()) ||
          null;

        if (!alive) return;

        if (!found) {
          setErr("Product not found.");
          return;
        }
        setProduct(found);

        const canonical = found.slug || slugify(found.id || found.name);
        if (canonical !== slug) navigate(`/products/${canonical}`, { replace: true });
      } catch (e) {
        if (!alive) return;
        setErr(e.message || "Failed to load product.");
      }
    })();
    return () => { alive = false; };
  }, [slug, navigate]);

  if (err) {
    return (
      <div className="container">
        <h2>{err}</h2>
        <Link className="btn" to="/products">Back to products</Link>
      </div>
    );
  }
  if (!product) return <div className="container">Loading…</div>;

  const unit = product.unit || "lb";
  const total = (Number(product.price || 0) * qty).toFixed(2);

  const decQty = () => setQty(q => Math.max(1, q - 1));
  const incQty = () => setQty(q => Math.min(99, q + 1));

  const handleAdd = () => {
    // normalize the product so cart has a stable key and required fields
    const normalized = {
      ...product,
      id: product.id ?? product.slug ?? product.name,
      name: product.name,
      price: Number(product.price || 0),
      unit: unit,
    };
    addToCart(normalized, qty);               // ✅ adds to context + localStorage
    // (Optional) navigate to cart or keep browsing:
    // navigate("/cart");
  };

  return (
    <div className="container" style={{ paddingBottom: "2rem" }}>
      <div style={{ margin: "0 0 1rem 0" }}>
        <Link to="/products" className="muted" style={{ textDecoration: "underline" }}>
          ← Back to products
        </Link>
      </div>

      <div className="card" style={{ display: "grid", gap: "1.5rem",
        gridTemplateColumns: "minmax(260px, 520px) 1fr", alignItems: "start", padding: "1.2rem" }}>
        <div>
          {product.image && (
            <img src={product.image} alt={product.name}
                 style={{ width: "100%", height: "auto", borderRadius: 12, objectFit: "cover" }} />
          )}
        </div>

        <div style={{ display: "grid", gap: "1rem" }}>
          <div>
            <h2 style={{ margin: 0 }}>{product.name}</h2>
            <div className="muted" style={{ marginTop: 4 }}>
              {product.category || "Product"}
              {product.isVeg === true ? " • Veg" : product.isVeg === false ? " • Non-veg" : ""}
              {product.rating ? ` • ★ ${product.rating}` : ""}
            </div>
          </div>

          {product.description && (
            <p style={{ margin: 0, lineHeight: 1.55 }}>{product.description}</p>
          )}

          <div style={{ fontSize: 22, fontWeight: 700 }}>
            ${product.price?.toFixed ? product.price.toFixed(2) : product.price}/{unit}
          </div>

          <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
            <div className="qty">
              <button onClick={decQty} aria-label="Decrease">−</button>
              <input readOnly value={qty} />
              <button onClick={incQty} aria-label="Increase">+</button>
            </div>

            <button className="btn primary" onClick={handleAdd} style={{ minWidth: 220 }}>
              Add to cart — ${total}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
