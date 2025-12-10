// src/components/BookingWidget.tsx
"use client";

import React, { useEffect, useState } from "react";

export type Service = {
  id: number;
  title: string;
  category: string;
  price: number;
  duration: number;
};

const SERVICES: Service[] = [
  { id: 1, title: "Tratamientos Faciales", category: "Facial", price: 40, duration: 60 },
  { id: 2, title: "Tratamientos Corporales", category: "Corporal", price: 45, duration: 60 },
  { id: 3, title: "Depilación Láser", category: "Depilación", price: 45, duration: 30 },
  { id: 4, title: "Maquillaje", category: "Maquillaje", price: 70, duration: 45 },
  { id: 5, title: "Manicura", category: "Uñas", price: 15, duration: 30 },
  { id: 6, title: "Pedicura", category: "Uñas", price: 10, duration: 30 },
  { id: 7, title: "Depilación Tradicional", category: "Depilación", price: 20, duration: 30 },
  { id: 8, title: "Diseño de Cejas", category: "Cejas y Pestañas", price: 25, duration: 30 },
  { id: 9, title: "Lifting de Pestañas", category: "Cejas y Pestañas", price: 35, duration: 45 },
  { id: 10, title: "Microblading", category: "Cejas y Pestañas", price: 180, duration: 120 },
  { id: 11, title: "Masajes Relajantes", category: "Masajes", price: 45, duration: 60 },
];

type Slot = { label: string; iso: string };

interface BookingWidgetProps {
  selectedService?: { id: number; title: string; category?: string; price?: number; duration?: number } | null;
}

export default function BookingWidget({ selectedService = null }: BookingWidgetProps) {
  const [date, setDate] = useState<string>(() => {
    const today = new Date();
    return today.toISOString().split("T")[0]; // YYYY-MM-DD
  });

  const [serviceId, setServiceId] = useState<number>(SERVICES[0].id);
  const currentService = SERVICES.find((s) => s.id === serviceId)!;

  const [slots, setSlots] = useState<Slot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [selectedTimeIso, setSelectedTimeIso] = useState<string | null>(null);
  const [bookingStatus, setBookingStatus] = useState<null | "ok" | "error">(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (selectedService && typeof selectedService.id === "number") {
      setServiceId(selectedService.id);
    }
  }, [selectedService]);

  useEffect(() => {
    let abort = false;
    async function fetchSlots() {
      setLoadingSlots(true);
      setSelectedTimeIso(null);
      setBookingStatus(null);
      try {
        const duration = currentService.duration ?? 60;
        const res = await fetch(
          `/api/availability?date=${encodeURIComponent(date)}&duration=${encodeURIComponent(duration)}&grid=15`
        );
        if (!res.ok) throw new Error(`Status ${res.status}`);
        const data = await res.json();
        if (abort) return;
        setSlots(Array.isArray(data.slots) ? data.slots : []);
      } catch (e) {
        console.error("fetchSlots error:", e);
        if (!abort) setSlots([]);
      } finally {
        if (!abort) setLoadingSlots(false);
      }
    }
    fetchSlots();
    return () => {
      abort = true;
    };
  }, [date, serviceId, currentService.duration]);

  async function handleBook() {
    if (!selectedTimeIso || !name) return;
    setBookingStatus(null);
    setSubmitting(true);

    try {
      const res = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          startIso: selectedTimeIso,
          date,
          name,
          email,
          notes,
          serviceId: currentService.id,
          serviceTitle: currentService.title,
          duration: currentService.duration,
          price: currentService.price,
        }),
      });

      if (res.ok) {
        setBookingStatus("ok");
        // mantener selección visible — opcional limpiar campos:
        // setName(""); setEmail(""); setNotes(""); setSelectedTimeIso(null);
      } else {
        console.error("booking failed", await res.text().catch(() => null));
        setBookingStatus("error");
      }
    } catch (e) {
      console.error("handleBook error:", e);
      setBookingStatus("error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="booking-widget" aria-live="polite">
      <div className="booking-header">
        <h3>Reserva tu cita</h3>
        <p>Elige servicio, día y hora — confirmación instantánea.</p>
      </div>

      <div className="booking-row">
        <label>
          Servicio:
          <select
            value={serviceId}
            onChange={(e) => setServiceId(Number(e.target.value))}
            aria-label="Selecciona servicio"
          >
            {SERVICES.map((s) => (
              <option key={s.id} value={s.id}>
                {s.title} — {s.price}€
              </option>
            ))}
          </select>
        </label>
        <div style={{ marginTop: 6 }}>
          <small>
            Duración: {currentService.duration} min · Categoría: {currentService.category}
          </small>
        </div>
      </div>

      <div className="booking-row">
        <label>
          Fecha:
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            aria-label="Selecciona fecha"
          />
        </label>
      </div>

      <div className="booking-row">
        <p>Horas disponibles (según duración del servicio):</p>

        {loadingSlots ? (
          <p>Cargando horarios...</p>
        ) : slots.length === 0 ? (
          <p>No hay huecos disponibles este día para este servicio.</p>
        ) : (
          <div className="booking-slots" role="list">
            {slots.map((slot) => {
              const isSelected = selectedTimeIso === slot.iso;
              return (
                <button
                  key={slot.iso}
                  type="button"
                  role="listitem"
                  className={`booking-slot-btn ${isSelected ? "is-selected" : ""}`}
                  aria-pressed={isSelected}
                  onClick={() => setSelectedTimeIso(slot.iso)}
                >
                  {slot.label}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="booking-row">
        <label>
          Nombre:
          <input
            type="text"
            placeholder="Tu nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
            aria-label="Nombre"
          />
        </label>
      </div>

<div className="booking-row">
  <label>
    Email:
    <input
      type="email"
      required
      placeholder="tuemail@ejemplo.com"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      aria-label="Email"
    />
  </label>
</div>


      <div className="booking-row">
        <label>
          Notas (opcional):
          <input
            type="text"
            placeholder="Alergias, observaciones, etc."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            aria-label="Notas (opcional)"
          />
        </label>
      </div>
        <div>
                <div className="booking-actions">
        <button
          type="button"
          className="booking-submit"
          onClick={handleBook}
          disabled={!selectedTimeIso || !name || submitting}
          aria-disabled={!selectedTimeIso || !name || submitting}
        >
          {submitting ? "Reservando…" : `Confirmar reserva — ${currentService.title}`}
        </button>
      </div>
        </div>


      <div aria-live="polite" style={{ minHeight: 28, marginTop: 12 }}>
        {bookingStatus === "ok" && <p className="booking-success">✅ Reserva realizada. Te llegará la cita a tu calendario / email.</p>}
        {bookingStatus === "error" && <p className="booking-error">❌ Ha habido un problema al reservar. Inténtalo de nuevo.</p>}
      </div>
    </div>
  );
}
