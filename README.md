# Online Food Store — Local Starter (React + Express)

This is a **ready-to-run** local project for an online food-selling store.

## What you get
- **Frontend:** React + Vite + React Router + Zustand (cart state) + Axios
- **Backend:** Express + CORS + simple in-memory data
- **Features:** Product catalog, product details, cart, checkout (mock), order confirmation

---

## Prerequisites
- Node.js **18+** (check with `node -v`)
- npm **9+** (check with `npm -v`)

---

## Quick Start (macOS / Windows / Linux)

1. **Download & unzip the project** (or clone if you prefer).  
2. Open two terminals:

### Terminal A — Backend
```bash
cd backend
npm install
npm run dev      # or: npm start
```
Backend runs on: **http://localhost:5001**

### Terminal B — Frontend
```bash
cd frontend
npm install
npm run dev
```
Vite will print a local URL like **http://localhost:5173**. Open it in your browser.

> If ports are busy, you can change them in `.env` (backend) and `vite.config.js` (frontend).

---

## Folder Structure
```
online-food-store-starter/
├── backend/
│   ├── package.json
│   ├── server.js
│   ├── .env
│   └── data/products.json
└── frontend/
    ├── package.json
    ├── index.html
    ├── vite.config.js
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── api/client.js
        ├── store/cart.js
        ├── components/
        │   ├── Navbar.jsx
        │   ├── Footer.jsx
        │   ├── ProductCard.jsx
        │   └── QuantitySelector.jsx
        └── pages/
            ├── Home.jsx
            ├── Products.jsx
            ├── ProductDetail.jsx
            ├── Cart.jsx
            ├── Checkout.jsx
            ├── OrderSuccess.jsx
            └── NotFound.jsx
```

---

## Next Steps (optional)
- Hook up real payments (Stripe) and inventory.
- Replace placeholder images with your product photos.
- Add auth (Firebase Auth or Auth0) if needed.
- Deploy separately (Render/Heroku for backend, Vercel/Netlify for frontend).

Happy building! 🍲
