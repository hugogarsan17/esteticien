"use client";

import React, { useState, useEffect } from "react";

export default function BookingWidget() {
  const [date, setDate] = useState<string>(() => {
    const today = new Date();
    return today.toISOString().split("T")[0]; // YYYY-MM-DD
  });
  const [slots, setSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [bookingStatus, setBookingStatus] = useState<null | "ok" | "error">(null);

  useEffect(() => {
    async function fetchSlots() {
      setLoadingSlots(true);
      setSelectedTime(null);
      setBookingStatus(null);
      try {
        const res = await fetch(`/api/availability?date=${date}`);
        const data = await res.json();
        setSlots(data.slots || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingSlots(false);
      }
    }
    fetchSlots();
  }, [date]);

  async function handleBook() {
    if (!selectedTime || !name) return;

    setBookingStatus(null);

    try {
      const res = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, time: selectedTime, name, email, notes }),
      });

      if (res.ok) {
        setBookingStatus("ok");
        // opcional: reset fields
        // setName(""); setEmail(""); setNotes(""); setSelectedTime(null);
      } else {
        setBookingStatus("error");
      }
    } catch (e) {
      console.error(e);
      setBookingStatus("error");
    }
  }

  return (
    <div className="booking-widget">
      <div className="booking-header">
        <h3>Reserva tu cita</h3>
        <p>Elige día y hora, y te confirmamos al instante.</p>
      </div>

      <div className="booking-row">
        <label>
          Fecha:
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </label>
      </div>

      <div className="booking-row">
        <p>Horas disponibles:</p>
        {loadingSlots ? (
          <p>Cargando horarios...</p>
        ) : slots.length === 0 ? (
          <p>No hay huecos disponibles este día.</p>
        ) : (
          <div className="booking-slots">
            {slots.map((slot) => (
              <button
                key={slot}
                type="button"
                className={`booking-slot-btn ${
                  selectedTime === slot ? "is-selected" : ""
                }`}
                onClick={() => setSelectedTime(slot)}
              >
                {slot}
              </button>
            ))}
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
          />
        </label>
      </div>

      <div className="booking-row">
        <label>
          Email (opcional):
          <input
            type="email"
            placeholder="para enviarte confirmación"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
      </div>

      <div className="booking-row">
        <label>
          Comentarios (opcional):
          <textarea
            placeholder="Tratamiento, dudas, etc."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </label>
      </div>

      <div className="booking-row">
        <button
          type="button"
          className="btn-reservar"
          onClick={handleBook}
          disabled={!selectedTime || !name}
        >
          Confirmar reserva
        </button>
      </div>

      {bookingStatus === "ok" && (
        <p className="booking-success">
          ✅ Reserva realizada. Te llegará la cita a tu calendario / email.
        </p>
      )}
      {bookingStatus === "error" && (
        <p className="booking-error">
          ❌ Ha habido un problema al reservar. Inténtalo de nuevo.
        </p>
      )}
    </div>
  );
}
