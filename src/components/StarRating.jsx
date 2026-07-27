import React from "react";

export default function StarRating({ rating }) {
  const rounded = Math.round(rating ? rating / 2 : 0);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        marginBottom: "4px",
        marginTop: "4px",
      }}
    >
      {[...Array(5)].map((_, i) => (
        <span
          key={i}
          style={{
            color: i < rounded ? "#facc15" : "#d1d5db",
            filter:
              i < rounded
                ? "drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))"
                : "none",
          }}
        >
          ★
        </span>
      ))}
      <span
        style={{
          marginLeft: "8px",
          color: "#be185d",
          fontWeight: "600",
          fontSize: "14px",
        }}
      >
        {(rating || 0).toFixed(1)}/10
      </span>
    </div>
  );
}
