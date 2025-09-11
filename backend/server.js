import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import path from "path";
import nodemailer from "nodemailer";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// --- Load Products ---
const dataPath = path.join(process.cwd(), "data", "products.json");
let products = [];
try {
  const raw = fs.readFileSync(dataPath, "utf-8");
  products = JSON.parse(raw);
} catch (err) {
  console.error("Failed to load products.json:", err.message);
}

// --- Email Transporter ---
let transporter;
if (process.env.SMTP_HOST) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
  });
}

// helper to send email
async function sendOwnerEmail({ subject, html }) {
  if (!transporter) {
    console.log("Email skipped: no SMTP configured");
    return;
  }
  await transporter.sendMail({
    from: process.env.FROM_EMAIL || "no-reply@local",
    to: process.env.OWNER_EMAIL,
    subject,
    html
  });
}

// --- Routes ---

// Health check
app.get("/api/health", (req, res) => {
  res.json({ ok: true, service: "food-store-backend", time: new Date().toISOString() });
});

// Get all products
app.get("/api/products", (req, res) => {
  res.json(products);
});

// Get product by id
app.get("/api/products/:id", (req, res) => {
  const product = products.find(p => p.id === req.params.id);
  if (!product) return res.status(404).json({ error: "Not found" });
  res.json(product);
});

// Create order
app.post("/api/orders", async (req, res) => {
  const { items, customer } = req.body || {};
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "No items in order" });
  }

  const orderId = uuidv4();
  const total = items.reduce((sum, i) => sum + (i.price * i.quantity), 0);
  const createdAt = new Date().toISOString();

  try {
    const rows = items.map(
      i => `<tr><td>${i.name}</td><td>${i.quantity}</td><td>$${i.price.toFixed(2)}</td></tr>`
    ).join("");

    await sendOwnerEmail({
      subject: `New Order ${orderId} — $${total.toFixed(2)}`,
      html: `
        <h2>New Order Received</h2>
        <p><strong>Order ID:</strong> ${orderId}</p>
        <p><strong>Customer:</strong> ${customer?.name || "Guest"} &lt;${customer?.email || "n/a"}&gt;</p>
        <p><strong>Created:</strong> ${createdAt}</p>
        <table border="1" cellpadding="6" cellspacing="0">
          <thead><tr><th>Item</th><th>Qty</th><th>Price</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
        <p><strong>Total:</strong> $${total.toFixed(2)}</p>
      `
    });
  } catch (e) {
    console.log("Email failed (continuing):", e.message);
  }

  res.status(201).json({
    orderId,
    total,
    currency: "USD",
    customer: customer || { name: "Guest" },
    createdAt
  });
});

// Contact form
app.post("/api/contact", async (req, res) => {
  const { name, email, message, orderId } = req.body || {};
  try {
    await sendOwnerEmail({
      subject: `Contact Request${orderId ? " about " + orderId : ""}`,
      html: `
        <h3>New Contact Request</h3>
        <p><strong>Name:</strong> ${name || "N/A"}</p>
        <p><strong>Email:</strong> ${email || "N/A"}</p>
        ${orderId ? `<p><strong>Order ID:</strong> ${orderId}</p>` : ""}
        <p><strong>Message:</strong></p>
        <pre>${(message || "").toString().slice(0, 5000)}</pre>
      `
    });
    res.status(200).json({ ok: true });
  } catch (e) {
    console.log("Contact email failed:", e.message);
    res.status(202).json({ ok: true }); // accept even if email fails
  }
});

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`✅ Backend listening on http://localhost:${PORT}`);
});
