"use client";

import React, { useEffect, useState } from "react";
import "./navbar.css";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  // bloquear scroll cuando el panel está abierto
  useEffect(() => {
    if (open) {
      document.body.classList.add("no-scroll");
      document.documentElement.style.scrollBehavior = "auto";
    } else {
      document.body.classList.remove("no-scroll");
      document.documentElement.style.scrollBehavior = "";
    }
    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, [open]);

  // Cerrar menú cuando se pulsa un enlace (mejor UX móvil)
  function handleLinkClick() {
    setOpen(false);
  }

  // Cerrar menú al redimensionar a desktop
  useEffect(() => {
    function onResize() {
      if (window.innerWidth > 768 && open) setOpen(false);
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [open]);

  return (
    <header className="navbar" role="banner">
      <div className="nav-inner container">
        <a className="brand" href="#inicio" aria-label="Lucia Esdo - Inicio">
          <img src="/logo-noback 2.png" alt="Lucia Esdo" />
        </a>

        {/* Desktop menu */}
        <nav className="nav-desktop" aria-label="Menú principal">
          <ul className="nav-list">
            <li><a href="#inicio">Inicio</a></li>
            <li><a href="#services">Servicios</a></li>
            <li><a href="#reservas">Reservas</a></li>
          </ul>
        </nav>

        {/* Toggle */}
<button
  className={`nav-toggle ${open ? "is-open" : ""}`}
  onClick={() => setOpen((s) => !s)}
  aria-label={open ? "Cerrar menú" : "Abrir menú"}
  aria-expanded={open}
  aria-controls="mobile-menu"
  type="button"
>
  {/* SVG hamburguesa (3 líneas) - stroke se controla por currentColor */}
  <svg width="28" height="24" viewBox="0 0 28 24" aria-hidden="true" focusable="false">
    <g fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h24"></path>
      <path d="M2 12h24"></path>
      <path d="M2 21h24"></path>
    </g>
  </svg>
</button>

      </div>

      {/* Overlay oscuro detrás del panel (mejora contraste) */}
      <div className={`mobile-overlay ${open ? "is-open" : ""}`} onClick={() => setOpen(false)} />

      {/* Panel móvil full-screen (centrado) */}
      <div
        id="mobile-menu"
        className={`mobile-panel ${open ? "is-open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-hidden={!open}
      >
        <div className="mobile-panel-inner">
          <button className="mobile-close" onClick={() => setOpen(false)} aria-label="Cerrar menú">
            ✕
          </button>

          <ul className="mobile-menu-list">
            <li><a href="#inicio" onClick={handleLinkClick}>Inicio</a></li>
            <li><a href="#services" onClick={handleLinkClick}>Servicios</a></li>
            <li><a href="#reservas" onClick={handleLinkClick}>Reservas</a></li>
          </ul>

          <div className="mobile-cta-row">
            <a className="mobile-cta" href="#reservas" onClick={handleLinkClick}>Reservar cita</a>
          </div>
        </div>
      </div>
    </header>
  );
}
