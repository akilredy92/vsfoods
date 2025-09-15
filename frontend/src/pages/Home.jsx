import React from "react";
import { Link } from "react-router-dom";
import Hero from "../components/Hero";
import FeatureStrip from "../components/FeatureStrip";
import Section from "../components/Section";
import SectionNav from "../components/SectionNav";

// Placeholder items you can replace later (images live in /public/images)
const sweets = [
  { id: "sw1", name: "Ghee Mysore Pak", price: 9.25, category: "Sweets", image: "/images/placeholder-sweets-1.jpg" },
  { id: "sw2", name: "Motichoor Ladoo", price: 8.50, category: "Sweets", image: "/images/placeholder-sweets-2.jpg" },
  { id: "sw3", name: "Kaju Katli",     price: 11.00, category: "Sweets", image: "/images/placeholder-sweets-3.jpg" },
  { id: "sw4", name: "Badam Burfi",    price: 10.50, category: "Sweets", image: "/images/placeholder-sweets-4.jpg" },
];

const hotOnes = [
  { id: "hot1", name: "Chilli Murukku", price: 5.75, category: "Snacks", image: "/images/placeholder-hot-1.jpg" },
  { id: "hot2", name: "Spicy Mixture",  price: 4.99, category: "Snacks", image: "/images/placeholder-hot-2.jpg" },
  { id: "hot3", name: "Masala Peanuts", price: 4.50, category: "Snacks", image: "/images/placeholder-hot-3.jpg" },
  { id: "hot4", name: "Karasev",        price: 5.25, category: "Snacks", image: "/images/placeholder-hot-4.jpg" },
];

const eveningSnacks = [
  { id: "ev1", name: "Onion Pakoda",   price: 4.75, category: "Snacks", image: "/images/placeholder-evening-1.jpg" },
  { id: "ev2", name: "Samosa (2pc)",   price: 3.50, category: "Snacks", image: "/images/placeholder-evening-2.jpg" },
  { id: "ev3", name: "Vada (2pc)",     price: 3.75, category: "Snacks", image: "/images/placeholder-evening-3.jpg" },
  { id: "ev4", name: "Banana Chips",   price: 3.99, category: "Snacks", image: "/images/placeholder-evening-4.jpg" },
];

const picklesVeg = [
  { id: "pv1", name: "Mango Pickle",   price: 7.99, category: "Pickles", image: "/images/placeholder-pickle-veg-1.jpg" },
  { id: "pv2", name: "Lemon Pickle",   price: 6.99, category: "Pickles", image: "/images/placeholder-pickle-veg-2.jpg" },
  { id: "pv3", name: "Gongura Pickle", price: 8.50, category: "Pickles", image: "/images/placeholder-pickle-veg-3.jpg" },
  { id: "pv4", name: "Tomato Pickle",  price: 7.25, category: "Pickles", image: "/images/placeholder-pickle-veg-4.jpg" },
];

const picklesNonVeg = [
  { id: "pn1", name: "Prawn Pickle",     price: 12.99, category: "Pickles", image: "/images/placeholder-pickle-nv-1.jpg" },
  { id: "pn2", name: "Chicken Pickle",   price: 11.99, category: "Pickles", image: "/images/placeholder-pickle-nv-2.jpg" },
  { id: "pn3", name: "Mutton Pickle",    price: 13.99, category: "Pickles", image: "/images/placeholder-pickle-nv-3.jpg" },
  { id: "pn4", name: "Fish Pickle",      price: 12.50, category: "Pickles", image: "/images/placeholder-pickle-nv-4.jpg" },
];

export default function Home() {
  return (
    <div className="container">
      {/* HERO (uses global themed bg, with dark overlay for readability) */}
      <Hero />

      {/* Feature strip */}
      <section style={{ marginTop: "1.5rem" }}>
        <FeatureStrip />
      </section>

      {/* Sticky sub-nav for the sections */}
      <SectionNav />

      {/* Sections that appear as you scroll */}
      <Section id="sweets" title="Sweets" items={sweets} />
      <Section id="hot" title="Hot Ones" items={hotOnes} />
      <Section id="evening" title="Evening Snacks" items={eveningSnacks} />
      <Section id="pickles-veg" title="Pickles — Veg" items={picklesVeg} />
      <Section id="pickles-nonveg" title="Pickles — Non-Veg" items={picklesNonVeg} />

      {/* CTA band */}
      <section style={{ margin: "2rem 0" }}>
        <div className="card" style={{
          padding: "1.2rem",
          background: "linear-gradient(90deg, var(--brand) 0%, #0f172a 100%)",
          color: "#fff",
          display: "grid",
          gridTemplateColumns: "1fr auto",
          alignItems: "center"
        }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 700 }}>Bulk / Party Orders?</div>
            <div className="muted" style={{ color: "rgba(255,255,255,.8)" }}>We’ll prepare fresh and pack as per your need.</div>
          </div>
          <Link className="btn secondary" to="/contact" style={{ justifySelf: "end" }}>Contact us</Link>
        </div>
      </section>
    </div>
  );
}
