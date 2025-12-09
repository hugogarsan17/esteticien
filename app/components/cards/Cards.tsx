// src/components/Cards.tsx
import React from "react";
import "./Cards.css";

export interface CardProps {
  img: string;
  title: string;
  desc: string;
  price: number;
  onClick?: () => void;
}

export default function Cards({ img, title, desc, price, onClick }: CardProps) {
  return (
    <div
      className="card-content"
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onClick && onClick();
      }}
      style={{
        backgroundImage: `url(${img})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        cursor: "pointer",
      }}
      aria-label={`Ver detalles y reservar ${title}`}
    >
      <div className="card-overlay">
        <h3>{title}</h3>
        <h4>Desde {price}€</h4>
        <p>{desc}</p>
      </div>
    </div>
  );
}
