"use client";

import React, { useState } from "react";
import "./whatsapp.css";

export default function Whatsapp() {
  const [open, setOpen] = useState(false);

  // PON AQUÍ TU NÚMERO EN FORMATO INTERNACIONAL, SIN ESPACIOS
  const phone = "34678638787"; // ejemplo: 34 + número de España
  const defaultMessage =
    "Hola, me gustaría pedir información sobre tus servicios 😊";

  const waLink = `https://wa.me/${phone}?text=${encodeURIComponent(
    defaultMessage
  )}`;

  return (
    <div className="whatsapp-widget">
      {/* Pop-up */}
      {open && (
        <div className="whatsapp-popup">
          <div className="whatsapp-popup-header">
            <span>¿Hablamos por WhatsApp?</span>
            <button
              className="whatsapp-popup-close"
              onClick={() => setOpen(false)}
              aria-label="Cerrar"
            >
              ×
            </button>
          </div>
          <div className="whatsapp-popup-body">
            <p>
              Resuelve tus dudas, pide cita o solicita información de forma
              rápida.
            </p>
            <a href={waLink} target="_blank" rel="noopener noreferrer">
              Abrir chat
            </a>
          </div>
        </div>
      )}

      {/* Botón flotante */}
      <button
        className="whatsapp-fab"
        onClick={() => setOpen(!open)}
        aria-label="Abrir chat de WhatsApp"
      >
        <span className="whatsapp-icon">
          {/* Logo oficial desde /public */}
          <img
            src="/logo-wass.png" // o .svg, como lo tengas
            alt="WhatsApp"
          />
        </span>
      </button>
    </div>
  );
}
