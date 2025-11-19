"use client";

import React, { useState } from "react";
import "./navbar.css"

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img src="/logo-noback.png" alt="logo" />
      </div>

      {/* Botón hamburguesa (solo móvil) */}
      <button
        className={`navbar-toggle ${open ? "is-open" : ""}`}
        onClick={() => setOpen(!open)}
        aria-label="Toggle menu"
      >
        <span />
        <span />
        <span />
      </button>

      <ul className={`navbar-menu ${open ? "is-open" : ""}`}>
        <li>Home</li>
        <li>Services</li>
        <li>Contact</li>
      </ul>
    </nav>
  );
}
