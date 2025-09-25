import React, { useEffect, useRef, useState, useCallback } from "react";
import ProductCard from "./ProductCard"; // uses your existing card component

export default function Section({ id, title, items = [] }) {
  const scrollerRef = useRef(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  const updateArrows = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanLeft(scrollLeft > 4);
    setCanRight(scrollLeft + clientWidth < scrollWidth - 4);
  }, []);

  const scrollByAmount = (dir) => {
    const el = scrollerRef.current;
    if (!el) return;
    const amount = Math.max(320, Math.floor(el.clientWidth * 0.9)); // almost a “page”
    el.scrollBy({ left: dir * amount, behavior: "smooth" });
  };

  useEffect(() => {
    updateArrows();
    const el = scrollerRef.current;
    if (!el) return;

    const onScroll = () => updateArrows();
    el.addEventListener("scroll", onScroll, { passive: true });

    // Resize observer to recalc when layout changes
    const ro = new ResizeObserver(updateArrows);
    ro.observe(el);

    return () => {
      el.removeEventListener("scroll", onScroll);
      ro.disconnect();
    };
  }, [updateArrows]);

  return (
    <section id={id} style={{ margin: "1.5rem 0" }}>
      <div className="row" style={{ justifyContent: "space-between", marginBottom: 8 }}>
        <h2>{title}</h2>
        {/* optional: link to full listing
        <a className="muted" href={`/products?cat=${encodeURIComponent(title)}`}>View all →</a>
        */}
      </div>

      <div className="hwrap">
        {/* Left chevron */}
        <button
          className={`chev left ${canLeft ? "show" : ""}`}
          aria-label="Scroll left"
          onClick={() => scrollByAmount(-1)}
        >
          <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
            <path d="M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z" fill="currentColor" />
          </svg>
        </button>

        {/* Scroll area */}
        <div ref={scrollerRef} className="hrow" role="region" aria-label={`${title} products`}>
          {items.map((p) => (
            <div className="hcell" key={p.id || p.slug || p.name}>
              <ProductCard product={p} />
            </div>
          ))}
        </div>

        {/* Right chevron */}
        <button
          className={`chev right ${canRight ? "show" : ""}`}
          aria-label="Scroll right"
          onClick={() => scrollByAmount(1)}
        >
          <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
            <path d="M8.59 16.59 10 18l6-6-6-6-1.41 1.41L13.17 12z" fill="currentColor" />
          </svg>
        </button>

        {/* Edge fades */}
        <div className={`fade left ${canLeft ? "show" : ""}`} aria-hidden="true" />
        <div className={`fade right ${canRight ? "show" : ""}`} aria-hidden="true" />
      </div>
    </section>
  );
}
