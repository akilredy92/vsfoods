// src/api/client.js
const API_BASE = import.meta.env.VITE_API_URL || "";
const HAS_BACKEND = !!import.meta.env.VITE_API_URL;

function slugify(s = "") {
  return String(s).toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

async function http(path, { method = "GET", body, headers } = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: { "Content-Type": "application/json", ...headers },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (res.status === 204) return null;
  const ct = res.headers.get("content-type") || "";
  const data = ct.includes("application/json") ? await res.json() : await res.text();
  if (!res.ok) throw new Error((data && data.message) || res.statusText || "Request failed");
  return data;
}

/* ============ PRODUCTS ============ */

// Load list (use backend only if configured)
export async function listProducts() {
  if (HAS_BACKEND) {
    try {
      const data = await http("/api/products");
      const arr = Array.isArray(data) ? data : (data?.items || []);
      return arr.map(p => ({ ...p, slug: p.slug || slugify(p.id || p.name) }));
    } catch {
      /* fall through to local */
    }
  }
  const res = await fetch("/products.json");
  if (!res.ok) throw new Error("Could not load products.json");
  const raw = await res.json();
  return raw.map(p => ({ ...p, slug: p.slug || slugify(p.id || p.name) }));
}

export async function getProductBySlug(slug) {
  const items = await listProducts();
  return items.find(p => p.slug === slug);
}

export async function getProduct(idOrName) {
  const items = await listProducts();
  const key = String(idOrName);
  const found = items.find(
    p => String(p.id) === key || String(p.name) === key || p.slug === slugify(key)
  );
  if (found) return found;

  if (HAS_BACKEND) {
    try {
      return await http(`/api/products/${encodeURIComponent(idOrName)}`);
    } catch { /* ignore */ }
  }
  throw new Error("Product not found");
}

// kept for older imports
export const getProducts = listProducts;

/* ============ ORDERS / CONTACT (unchanged) ============ */
export async function createOrder(order) {
  if (HAS_BACKEND) {
    try { return await http("/api/orders", { method: "POST", body: order }); }
    catch { /* mock below */ }
  }
  return new Promise(r => setTimeout(() => r({ orderId: `dev_${Date.now()}`, received: order }), 400));
}

export async function sendContact(payload) {
  if (HAS_BACKEND) {
    try { return await http("/api/contact", { method: "POST", body: payload }); }
    catch { /* mock below */ }
  }
  return new Promise(r => setTimeout(() => r({ success: true }), 300));
}
