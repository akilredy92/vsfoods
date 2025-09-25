import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const slides = [
  {
    id: 1,
    title: "Taste of Home, Made Fresh",
    subtitle: "Preservative-free snacks & pickles crafted in small batches.",
    cta1: { text: "Shop Products", link: "/products" },
    cta2: { text: "Contact Us", link: "/contact" },
    bg: "linear-gradient(135deg, #6ee7b7, #3b82f6)", // background gradient
  },
  {
    id: 2,
    title: "Trending Now",
    subtitle: "Our customers’ most-loved picks, reordered every week.",
    cta1: { text: "View Trending", link: "/products?filter=trending" },
    cta2: { text: "Order Now", link: "/products" },
    bg: "linear-gradient(135deg, #fbbf24, #ef4444)", // background gradient
  },
];

export default function Hero() {
  const [index, setIndex] = useState(0);

  // auto rotate every 2s
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[index];

  return (
    <div
      className="hero"
      style={{
        background: slide.bg,
        color: "#fff",
        padding: "4rem 1rem",
        borderRadius: 16,
        textAlign: "center",
        position: "relative",
        transition: "background 0.6s ease-in-out",
      }}
    >
      <h1 style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>{slide.title}</h1>
      <p style={{ fontSize: "1.2rem", marginBottom: "1.5rem" }}>{slide.subtitle}</p>
      <div style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
        <Link className="btn primary" to={slide.cta1.link}>
          {slide.cta1.text}
        </Link>
        <Link className="btn" to={slide.cta2.link}>
          {slide.cta2.text}
        </Link>
      </div>

      {/* dots indicator */}
      <div
        style={{
          marginTop: "1rem",
          display: "flex",
          justifyContent: "center",
          gap: "0.5rem",
        }}
      >
        {slides.map((s, i) => (
          <button
            key={s.id}
            onClick={() => setIndex(i)}
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              border: "none",
              background: i === index ? "#fff" : "rgba(255,255,255,0.5)",
              cursor: "pointer",
            }}
          />
        ))}
      </div>
    </div>
  );
}
