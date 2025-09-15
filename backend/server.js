// backend/server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import path from "path";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

dotenv.config();

const app = express();

/* =========================
   Config
========================= */
const PORT = process.env.PORT || 5001;
const DATA_DIR = path.join(process.cwd(), "data");
const PRODUCTS_PATH = path.join(DATA_DIR, "products.json");
const USERS_PATH = path.join(DATA_DIR, "users.json");
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";

/* =========================
   Middleware
========================= */
app.use(cors());
app.use(express.json());

/* Optional auth (attach req.user if token is present) */
function authOptional(req, _res, next) {
  const h = req.headers.authorization || "";
  const token = h.startsWith("Bearer ") ? h.slice(7) : null;
  if (token) {
    try { req.user = jwt.verify(token, JWT_SECRET); } catch {}
  }
  next();
}
function authRequired(req, res, next) {
  const h = req.headers.authorization || "";
  const token = h.startsWith("Bearer ") ? h.slice(7) : null;
  if (!token) return res.status(401).json({ error: "Unauthorized" });
  try { req.user = jwt.verify(token, JWT_SECRET); return next(); }
  catch { return res.status(401).json({ error: "Unauthorized" }); }
}
app.use(authOptional);

/* =========================
   File helpers
========================= */
function ensureDataFiles() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(PRODUCTS_PATH)) fs.writeFileSync(PRODUCTS_PATH, "[]");
  if (!fs.existsSync(USERS_PATH)) fs.writeFileSync(USERS_PATH, "[]");
}
ensureDataFiles();

function loadJSON(p) {
  try { return JSON.parse(fs.readFileSync(p, "utf-8")); }
  catch { return []; }
}
function saveJSON(p, v) {
  fs.writeFileSync(p, JSON.stringify(v, null, 2));
}

/* =========================
   Products (load once)
========================= */
let products = loadJSON(PRODUCTS_PATH);

/* =========================
   Email (Nodemailer)
========================= */
let transporter = null;
if (process.env.SMTP_HOST) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
}

async function sendOwnerEmail({ subject, html }) {
  if (!transporter || !process.env.OWNER_EMAIL) {
    console.log("Email skipped (no SMTP/OWNER_EMAIL configured)");
    return;
  }
  await transporter.sendMail({
    from: process.env.FROM_EMAIL || "no-reply@local",
    to: process.env.OWNER_EMAIL,
    subject,
    html
  });
}

/* =========================
   Routes
========================= */

/* Health */
app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "vsfoods-backend", time: new Date().toISOString() });
});

/* Products */
app.get("/api/products", (_req, res) => {
  res.json(products);
});
app.get("/api/products/:id", (req, res) => {
  const p = products.find(x => x.id === req.params.id);
  if (!p) return res.status(404).json({ error: "Not found" });
  res.json(p);
});

/* Auth: signup/login/me */
app.post("/api/auth/signup", async (req, res) => {
  const { name = "", email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: "Email & password required" });

  const users = loadJSON(USERS_PATH);
  const exists = users.find(u => u.email.toLowerCase() === String(email).toLowerCase());
  if (exists) return res.status(409).json({ error: "Email already registered" });

  const hash = await bcrypt.hash(password, 10);
  const user = { id: uuidv4(), name, email, password: hash, createdAt: new Date().toISOString() };
  users.push(user);
  saveJSON(USERS_PATH, users);

  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "7d" });
  res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body || {};
  const users = loadJSON(USERS_PATH);
  const user = users.find(u => u.email.toLowerCase() === String(email).toLowerCase());
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json({ error: "Invalid credentials" });

  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "7d" });
  res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
});

app.get("/api/auth/me", authRequired, (req, res) => {
  res.json({ user: { id: req.user.id, email: req.user.email } });
});

/* Contact -> email owner */
app.post("/api/contact", async (req, res) => {
  const { name, email, message, orderId } = req.body || {};
  try {
    await sendOwnerEmail({
      subject: `Contact Request${orderId ? ` about ${orderId}` : ""}`,
      html: `
        <h3>New Contact Request</h3>
        <p><strong>Name:</strong> ${name || "N/A"}</p>
        <p><strong>Email:</strong> ${email || "N/A"}</p>
        ${orderId ? `<p><strong>Order ID:</strong> ${orderId}</p>` : ""}
        <p><strong>Message:</strong></p>
        <pre>${(message || "").toString().slice(0, 5000)}</pre>
      `
    });
    res.json({ ok: true });
  } catch (e) {
    console.log("Contact email failed:", e.message);
    res.status(202).json({ ok: true });
  }
});

/* Orders -> create + email owner (10% discount if logged in) */
app.post("/api/orders", async (req, res) => {
  const { items, customer } = req.body || {};
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "No items in order" });
  }

  const subtotal = items.reduce((sum, i) => sum + (Number(i.price) * Number(i.quantity || 1)), 0);
  const isMember = Boolean(req.user?.id);
  const discountRate = isMember ? 0.10 : 0;
  const discount = +(subtotal * discountRate).toFixed(2);
  const total = +(subtotal - discount).toFixed(2);

  const orderId = uuidv4();
  const createdAt = new Date().toISOString();

  try {
    const rows = items.map(i =>
      `<tr><td>${i.name}</td><td>${i.quantity}</td><td>$${Number(i.price).toFixed(2)}</td></tr>`
    ).join("");
    await sendOwnerEmail({
      subject: `New Order ${orderId} — $${total.toFixed(2)}${isMember ? " (10% member discount)" : ""}`,
      html: `
        <h2>New Order Received</h2>
        <p><strong>Order ID:</strong> ${orderId}</p>
        <p><strong>Customer:</strong> ${customer?.name || "Guest"} &lt;${customer?.email || "n/a"}&gt;</p>
        <p><strong>Created:</strong> ${createdAt}</p>
        ${isMember ? "<p><strong>Member discount:</strong> 10% applied</p>" : ""}
        <table border="1" cellpadding="6" cellspacing="0">
          <thead><tr><th>Item</th><th>Qty</th><th>Price</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
        <p><strong>Subtotal:</strong> $${subtotal.toFixed(2)}</p>
        ${isMember ? `<p><strong>Discount:</strong> -$${discount.toFixed(2)}</p>` : ""}
        <p><strong>Total:</strong> $${total.toFixed(2)}</p>
      `
    });
  } catch (e) {
    console.log("Order email failed (continuing):", e.message);
  }

  res.status(201).json({
    orderId,
    subtotal,
    discount,
    total,
    currency: "USD",
    member: isMember,
    customer: customer || { name: "Guest" },
    createdAt
  });
});

/* =========================
   Start server
========================= */
app.listen(PORT, () => {
  console.log(`✅ VS Foods backend running at http://localhost:${PORT}`);
});