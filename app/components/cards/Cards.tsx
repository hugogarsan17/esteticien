// @ts-nocheck
import React from "react";
import "./Cards.css";

export default function Cards({ img, title, desc, price }) {
  return (
    <div
      className="card-content"
      style={{
        backgroundImage: `url(${img})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="card-overlay">
        <h3>{title}</h3>
        <h4>Desde {price}€</h4>
        <p>{desc}</p>
      </div>
    </div>
  );
}
