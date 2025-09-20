import React from "react";
import { Link } from "react-router-dom";
import Hero from "../components/Hero";
import FeatureStrip from "../components/FeatureStrip";
import Section from "../components/Section";
import SectionNav from "../components/SectionNav";

// Placeholder items you can replace later (images live in /public/images)
const sweets = [
  { id: "Ghee Mysore Pak", name: "Ghee Mysore Pak", price: 9.25, image: "/images/gheemysorepak.jpg" },
  { id: "Motichoor Ladoo", name: "Motichoor Ladoo", price: 8.50, image: "/images/Motichoor-laddoo.jpg" },
  { id: "Kaju Katli", name: "Kaju Katli",     price: 11.00, image: "/images/Kaju-Katli.jpg" },
  { id: "Badam Burfi", name: "Badam Burfi",    price: 10.50, image: "/images/badam-burfi.jpg" },
];

const hotOnes = [
  { id: "Chilli Murukku", name: "Chilli Murukku", price: 5.75, image: "/images/murukku.jpg" },
  { id: "Spicy Mixture", name: "Spicy Mixture",  price: 4.99, image: "/images/SpicyMixture.jpg" },
  { id: "Masala Peanuts", name: "Masala Peanuts", price: 4.50, image: "/images/Masala-Peanuts.jpg" },
  { id: "Karasev", name: "Karasev",        price: 5.25, image: "/images/kara-sev.jpg" },
];

const eveningSnacks = [
  { id: "Onion Pakoda", name: "Onion Pakoda",   price: 4.75, image: "/images/Onion-Pakora.jpg" },
  { id: "Samosa (2pc)", name: "Samosa (2pc)",   price: 5.50, image: "/images/samosa.jpg" },
  { id: "Vada (2pc)", name: "Vada (2pc)",     price: 5.75, image: "/images/Medu-Vada.jpg" },
  { id: "Samosa Chaat", name: "Samosa Chaat",   price: 6.99, image: "/images/samosa-chaat.jpg" },
];

const picklesVeg = [
  { id: "Classic Mango Pickle", name: "Mango Pickle",   price: 7.99, image: "/images/mango-pickle.jpg" },
  { id: "Lemon Pickle", name: "Lemon Pickle",   price: 6.99, image: "/images/lemon-pickle.jpg" },
  { id: "Gongura Pickle", name: "Gongura Pickle", price: 8.50, image: "/images/gongura_pickle.jpg" },
  { id: "Tomato Pickle", name: "Tomato Pickle",  price: 7.25, image: "/images/tomato-pickle.jpg" },
];

const picklesNonVeg = [
  { id: "Chicken Pickle", name: "Chicken Pickle",     price: 12.99, image: "/images/chicken-pickle-with-bone.jpg" },
  { id: "Chicken Pickle Boneless", name: "Chicken Pickle Boneless",   price: 11.99, image: "/images/chicken-pickle-without-bone.jpg" },
  { id: "Mutton Pickle", name: "Mutton Pickle",    price: 13.99, image: "/images/mutton-pickle.jpg" },
  { id: "Fish Pickle", name: "Fish Pickle",      price: 13.50, image: "/images/fish-pickle.jpg" },
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
