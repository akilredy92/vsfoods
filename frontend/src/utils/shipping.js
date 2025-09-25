// src/utils/shipping.js

/** Keep ZIP to 5 digits (accepts ZIP+4, strips non-digits) */
export function normalizeZip(zip = "") {
  const only = String(zip).replace(/[^\d]/g, "");
  return only.slice(0, 5);
}

/**
 * Total cart weight in pounds.
 * If a line/product has unit "lb" (or "lbs"/"pound"), we treat 1 qty = 1 lb.
 * Otherwise we assume 0.75 lb per qty as a fallback.
 */
export function cartWeightLb(cart = []) {
  return cart.reduce((sum, line) => {
    const u = (line?.unit || line?.product?.unit || "").toLowerCase();
    const q = Number(line?.quantity ?? line?.qty ?? 1);
    if (u === "lb" || u === "lbs" || u === "pound" || u === "pounds") return sum + q;
    return sum + 0.75 * q;
  }, 0);
}

function r2(n) { return Math.round(n * 100) / 100; }

/** CONFIG — tweak these anytime */
export const SHIPPING_RULES = {
  ORIGIN_PREFIX3: (import.meta?.env?.VITE_SHIP_FROM_ZIP || "27526").slice(0, 3),

  // Local delivery eligibility by ZIP prefix (first 3 digits)
  LOCAL_PREFIXES: ["275", "276"],

  // Local delivery price
  LOCAL_RATE: 2.99,

  // Flat rates by weight (STANDARD shipping)
  FLAT_UNDER_5LB: 4.99,      // 0–4.99 lb
  FLAT_5_TO_10LB: 8.99,      // 5–10 lb
  FLAT_OVER_10LB: 13.99,     // >10 lb

  // Free shipping threshold (STANDARD only)
  FREE_STANDARD_OVER: 100.0,
};

/** Cheap check for "is this zip in local delivery zone?" */
export function isLocalZip(zip) {
  const z = normalizeZip(zip);
  if (z.length < 3) return false;
  return SHIPPING_RULES.LOCAL_PREFIXES.includes(z.slice(0, 3));
}

/** Returns STANDARD shipping amount given weight & subtotal */
export function standardAmount(weightLb, subtotal) {
  if (subtotal >= SHIPPING_RULES.FREE_STANDARD_OVER) return 0;

  const w = Math.max(0, Number(weightLb) || 0);
  if (w < 5) return SHIPPING_RULES.FLAT_UNDER_5LB;
  if (w <= 10) return SHIPPING_RULES.FLAT_5_TO_10LB;
  return SHIPPING_RULES.FLAT_OVER_10LB;
}

/**
 * Build shipping options for the given inputs.
 * Returns an array of options:
 * { id, label, amount, requiresZip, available, note }
 */
export function shippingOptions(zip, cart, subtotal) {
  const weight = cartWeightLb(cart);
  const zip5 = normalizeZip(zip);

  const options = [];

  // 1) Pickup — always available, $0
  options.push({
    id: "pickup",
    label: "Pickup (Free)",
    amount: 0,
    requiresZip: false,
    available: true,
    note: "Pick up from store (we’ll confirm address after order).",
  });

  // 2) Local Delivery — only if ZIP in local list
  const localOk = !!zip5 && isLocalZip(zip5);
  options.push({
    id: "local",
    label: `Local Delivery ${localOk ? `($${SHIPPING_RULES.LOCAL_RATE.toFixed(2)})` : "(enter local ZIP)"}`,
    amount: localOk ? SHIPPING_RULES.LOCAL_RATE : 0,
    requiresZip: true,
    available: localOk,
    note: "Available in select local ZIPs.",
  });

  // 3) Standard Shipping — needs a ZIP
  let stdAmt = 0;
  let stdNote = "";
  let stdAvail = false;
  if (zip5 && zip5.length === 5) {
    stdAmt = standardAmount(weight, subtotal);
    stdAvail = true;
    stdNote = subtotal >= SHIPPING_RULES.FREE_STANDARD_OVER
      ? "Free standard shipping (order over $100)."
      : `Weight: ${Math.ceil(weight)} lb`;
  } else {
    stdNote = "Enter ZIP to see rate.";
  }
  options.push({
    id: "standard",
    label: stdAmt === 0 ? "Standard Shipping (Free)" : `Standard Shipping ($${stdAmt.toFixed(2)})`,
    amount: stdAmt,
    requiresZip: true,
    available: stdAvail,
    note: stdNote,
  });

  return options;
}

/**
 * Select a shipping option.
 * If preferredId is provided and available, returns that;
 * otherwise returns the cheapest available option.
 * Output: { selected, options }
 */
export function calcShipping(zip, cart, subtotal, preferredId) {
  const opts = shippingOptions(zip, cart, subtotal);
  const available = opts.filter(o => o.available);

  let selected = null;

  if (preferredId) {
    selected = available.find(o => o.id === preferredId) || null;
  }
  if (!selected) {
    // choose cheapest available
    selected = available.sort((a, b) => a.amount - b.amount)[0] || null;
  }

  return { selected, options: opts };
}
