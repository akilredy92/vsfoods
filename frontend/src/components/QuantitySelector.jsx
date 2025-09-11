import React from "react";

export default function QuantitySelector({ value, onChange }) {
  return (
    <div className="qty">
      <button onClick={() => onChange(Math.max(1, value - 1))}>−</button>
      <input value={value} readOnly />
      <button onClick={() => onChange(value + 1)}>+</button>
    </div>
  );
}

