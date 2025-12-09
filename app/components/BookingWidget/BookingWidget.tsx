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
  // Se puede pasar null si no hay servicio preseleccionado
  selectedService?: { id: number; title: string; category?: string; price?: number; duration?: number } | null;
}

export default function BookingWidget({ selectedService = null }: BookingWidgetProps) {
  const [date, setDate] = useState<string>(() => {
    const today = new Date();
    return today.toISOString().split("T")[0]; // YYYY-MM-DD
  });

  // serviceId interno (se sincroniza con `selectedService` cuando se pasa por props)
  const [serviceId, setServiceId] = useState<number>(SERVICES[0].id);
  const currentService = SERVICES.find((s) => s.id === serviceId)!;

  const [slots, setSlots] = useState<Slot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [selectedTimeIso, setSelectedTimeIso] = useState<string | null>(null);
  const [bookingStatus, setBookingStatus] = useState<null | "ok" | "error">(null);

  // Si el prop selectedService cambia, sincronizamos el selector interno
  useEffect(() => {
    if (selectedService && typeof selectedService.id === "number") {
      setServiceId(selectedService.id);
    }
  }, [selectedService]);

  // Fetch slots cada vez que cambie la fecha o el servicio seleccionado internamente
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
  }, [date, serviceId]); // refetch cuando cambie la fecha o el servicio

  async function handleBook() {
    if (!selectedTimeIso || !name) return;

    setBookingStatus(null);

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
        // opcional: limpiar campos
        // setName(""); setEmail(""); setNotes(""); setSelectedTimeIso(null);
      } else {
        const err = await res.json().catch(() => null);
        console.error("booking failed", err);
        setBookingStatus("error");
      }
    } catch (e) {
      console.error("handleBook error:", e);
      setBookingStatus("error");
    }
  }

  return (
    <div className="booking-widget">
      <div className="booking-header">
        <h3>Reserva tu cita</h3>
        <p>Elige servicio, día y hora — confirmación instantánea.</p>
      </div>

      <div className="booking-row">
        <label>
          Servicio:
          <select value={serviceId} onChange={(e) => setServiceId(Number(e.target.value))}>
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
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </label>
      </div>

      <div className="booking-row">
        <p>Horas disponibles (según duración del servicio):</p>
        {loadingSlots ? (
          <p>Cargando horarios...</p>
        ) : slots.length === 0 ? (
          <p>No hay huecos disponibles este día para este servicio.</p>
        ) : (
          <div className="booking-slots" style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {slots.map((slot) => (
              <button
                key={slot.iso}
                type="button"
                className={`booking-slot-btn ${selectedTimeIso === slot.iso ? "is-selected" : ""}`}
                onClick={() => setSelectedTimeIso(slot.iso)}
                style={{
                  padding: "8px 12px",
                  borderRadius: 6,
                  border: selectedTimeIso === slot.iso ? "2px solid #2b6cb0" : "1px solid #ccc",
                  background: selectedTimeIso === slot.iso ? "#e6f2ff" : "#fff",
                }}
              >
                {slot.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="booking-row">
        <label>
          Nombre:
          <input type="text" placeholder="Tu nombre" value={name} onChange={(e) => setName(e.target.value)} />
        </label>
      </div>

      <div className="booking-row">
        <label>
          Email (opcional):
          <input type="email" placeholder="para enviarte confirmación" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
      </div>

      <div className="booking-row">
        <label>
          Notas (opcional):
          <input type="text" placeholder="Alergias, observaciones, etc." value={notes} onChange={(e) => setNotes(e.target.value)} />
        </label>
      </div>

      <div className="booking-row">
        <button type="button" className="btn-reservar" onClick={handleBook} disabled={!selectedTimeIso || !name}>
          Confirmar reserva — {currentService.title}
        </button>
      </div>

      {bookingStatus === "ok" && <p className="booking-success">✅ Reserva realizada. Te llegará la cita a tu calendario / email.</p>}
      {bookingStatus === "error" && <p className="booking-error">❌ Ha habido un problema al reservar. Inténtalo de nuevo.</p>}
    </div>
  );
}
