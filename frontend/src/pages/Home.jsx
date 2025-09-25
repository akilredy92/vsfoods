import React from "react";
import { Link } from "react-router-dom";
import Hero from "../components/Hero";
import FeatureStrip from "../components/FeatureStrip";
import Section from "../components/Section";
import SectionNav from "../components/SectionNav";

// Placeholder items you can replace later (images live in /public/images)
const sweets = [
  { id: "Ghee Mysore Pak", name: "Ghee Mysore Pak", price: 19.99, image: "/images/gheemysorepak.jpg" },
  { id: "Motichoor Ladoo", name: "Motichoor Ladoo", price: 15.99, image: "/images/Motichoor-laddoo.jpg" },
  { id: "Kaju Katli", name: "Kaju Katli",     price: 15.99, image: "/images/Kaju-Katli.jpg" },
  { id: "Boondi laddu", name: "Boondi laddu",    price: 14.99, image: "/images/badam-burfi.jpg" },
  { id: "Ravva Laddu", name: "Ravva Laddu",    price: 14.99, image: "/images/Boondi-Laddu.jpg" },
  { id: "Sunnundalu", name: "Sunnundalu",    price: 17.99, image: "/images/sunnunda.jpg" },
  { id: "Bellam Gavvalu", name: "Bellam Gavvalu",    price: 16.99, image: "/images/Bellam Gavvalu.jpg" },
  { id: "Arisalu", name: "Arisalu",    price: 19.99, image: "/images/Arisalu.jpg" },
  { id: "Palli Patti", name: "Palli Patti",    price: 15.99, image: "/images/Palli Patti.jpg" },
  { id: "Baadusha", name: "Baadusha",    price: 15.99, image: "/images/Baadusha.jpg" },
  { id: "Kakinada Kaaja", name: "Kakinada Kaaja",    price: 16.99, image: "/images/Kakinada Kaaja.jpg" },
  { id: "Kaju Pista Roll", name: "Kaju Pista Roll",    price: 19.99, image: "/images/Kaju Pista Roll.jpg" },
  { id: "Ragi Laddu", name: "Ragi Laddu",    price: 18.99, image: "/images/raagi laddu.jpg" },
  { id: "Dry fruit Laddu", name: "Dry fruit Laddu",    price: 19.99, image: "/images/Dry fruit Laddu.jpg" },
  { id: "Coconut Sweet", name: "Coconut Sweet",    price: 15.99, image: "/images/Kobari-Louse.jpg" },
  { id: "KaarachiHalwa", name: "KaarachiHalwa",    price: 18.99, image: "/images/Karachi Halwa.jpg" },
  { id: "Paalakova", name: "Paalakova",    price: 17.99, image: "/images/paalakova.jpg" },

];

const hotOnes = [
  { id: "Spicy Mixture", name: "Spicy Mixture",  price: 18.99, image: "/images/SpicyMixture.jpg" },
  { id: "Masala Peanuts", name: "Masala Peanuts", price: 14.99, image: "/images/Masala-Peanuts.jpg" },
  { id: "Chakralu", name: "Chakralu",        price: 17.99, image: "/images/Janthikalu-Chakralu.jpg" },
  { id: "Kaarapusa", name: "Kaarapusa",        price: 17.99, image: "/images/Kaarapusa.jpg" },
  { id: "Chekkalu", name: "Chekkalu",        price: 17.99, image: "/images/Chekkalu.jpg" },
  { id: "Raagi Chekkalu", name: "Raagi Chekkalu",        price: 17.99, image: "/images/Raagi chakralu.jpg" },
  { id: "Kaara Boondi", name: "Kaara Boondi",        price: 17.99, image: "/images/kara-boondi.jpg" },
  { id: "Dalmudi Mixture", name: "Dalmudi Mixture",        price: 17.99, image: "/images/Dalmudi Mixture.jpg" },
  { id: "Chakodi", name: "Chakodi",        price: 15.99, image: "/images/chakodi.jpg" },
  { id: "Aaku Pakodi", name: "Aaku Pakodi",        price: 15.99, image: "/images/Aakupakodi.jpg" },
  { id: "Chakli", name: "Chakli",        price: 17.99, image: "/images/Chakli.jpg" },
];

const picklesVeg = [
  { id: "Classic Mango Pickle", name: "Mango Pickle",   price: 16.99, image: "/images/mango-pickle.jpg" },
  { id: "Lemon Pickle", name: "Lemon Pickle",   price: 16.99, image: "/images/lemon-pickle.jpg" },
  { id: "Gongura Pickle", name: "Gongura Pickle", price: 16.99, image: "/images/gongura_pickle.jpg" },
  { id: "Ginger Pickle", name: "Ginger Pickle", price: 16.99, image: "/images/allam-pachadi.jpg" },
  { id: "Tomato Pickle", name: "Tomato Pickle",  price: 15.99, image: "/images/tomato-pickle.jpg" },
  { id: "Karella(Kakarkaya) Pickle", name: "Kakarkaya Pickle", price: 15.99, image: "/images/Kakarkaya pickle.jpg" },
];

const picklesNonVeg = [
  { id: "Chicken Pickle", name: "Chicken Pickle",     price: 20.99, image: "/images/chicken-pickle-with-bone.jpg" },
  { id: "Chicken Pickle Boneless", name: "Chicken Pickle Boneless",   price: 21.99, image: "/images/chicken-pickle-without-bone.jpg" },
  { id: "Mutton Pickle", name: "Mutton Pickle",    price: 26.99, image: "/images/mutton-pickle.jpg" },
  { id: "Fish Pickle", name: "Fish Pickle",      price: 26.99, image: "/images/fish-pickle.jpg" },
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
