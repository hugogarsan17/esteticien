"use client";

import React, { useEffect, useMemo, useState } from "react";
import { SERVICES, Service } from "../../data/service";

type Slot = { label: string; iso: string };

interface BookingWidgetProps {
  selectedService?: Service | null;
}

export default function BookingWidget({ selectedService = null }: BookingWidgetProps) {
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [serviceId, setServiceId] = useState<number | null>(null);

  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedTimeIso, setSelectedTimeIso] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");

  const [loadingSlots, setLoadingSlots] = useState(false);
  const [bookingStatus, setBookingStatus] = useState<null | "ok" | "error">(null);
  const [submitting, setSubmitting] = useState(false);

  

  /* ================= PRESELECCIÓN DESDE HOME ================= */
  useEffect(() => {
    if (selectedService) {
      setCategory(selectedService.category);
      setSubcategory(selectedService.subcategory);
      setServiceId(selectedService.id);
    }
  }, [selectedService]);

  /* ================= SELECT OPTIONS ================= */

  const categories = useMemo(
    () => [...new Set(SERVICES.map(s => s.category))],
    []
  );

  const subcategories = useMemo(() => {
    if (!category) return [];
    return [...new Set(
      SERVICES.filter(s => s.category === category).map(s => s.subcategory)
    )];
  }, [category]);

  const availableServices = useMemo(() => {
    if (!category || !subcategory) return [];
    return SERVICES.filter(
      s => s.category === category && s.subcategory === subcategory
    );
  }, [category, subcategory]);

  const currentService = SERVICES.find(s => s.id === serviceId) ?? null;

  /* ================= SLOTS ================= */
  useEffect(() => {
  if (currentService === null) return;

  const service: Service = currentService; // 👈 CLAVE
  let abort = false;

  async function fetchSlots() {
    setLoadingSlots(true);
    setSelectedTimeIso(null);
    setBookingStatus(null);

    try {
      const res = await fetch(
        `/api/availability?date=${date}&duration=${service.duration}&grid=15`
      );
      const data = await res.json();
      if (!abort) setSlots(data.slots ?? []);
    } catch {
      if (!abort) setSlots([]);
    } finally {
      if (!abort) setLoadingSlots(false);
    }
  }

  fetchSlots();
  return () => {
    abort = true;
  };
}, [date, currentService]);


  /* ================= BOOK ================= */
  async function handleBook() {
    
    if (!currentService || !selectedTimeIso || !name) return;

    setSubmitting(true);
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
          service: currentService,
        }),
      });

      setBookingStatus(res.ok ? "ok" : "error");
    } catch {
      setBookingStatus("error");
    } finally {
      setSubmitting(false);
    }
  }

  /* ================= JSX ================= */

  return (
    <div className="booking-widget">

      <h3>Reserva tu cita</h3>

      {/* CATEGORÍA */}
      <div className="booking-row">
        <label>
          Categoría
          <select
            value={category}
            onChange={e => {
              setCategory(e.target.value);
              setSubcategory("");
              setServiceId(null);
            }}
          >
            <option value="">Selecciona categoría</option>
            {categories.map(c => <option key={c}>{c}</option>)}
          </select>
        </label>
      </div>

      {/* SUBCATEGORÍA */}
      {category && (
        <div className="booking-row">
          <label>
            Subcategoría
            <select
              value={subcategory}
              onChange={e => {
                setSubcategory(e.target.value);
                setServiceId(null);
              }}
            >
              <option value="">Selecciona subcategoría</option>
              {subcategories.map(sc => <option key={sc}>{sc}</option>)}
            </select>
          </label>
        </div>
      )}

      {/* SERVICIO */}
      {subcategory && (
        <div className="booking-row">
          <label>
            Servicio
            <select
              value={serviceId ?? ""}
              onChange={e => setServiceId(Number(e.target.value))}
            >
              <option value="">Selecciona servicio</option>
              {availableServices.map(s => (
                <option key={s.id} value={s.id}>
                  {s.title} — {s.price}€
                </option>
              ))}
            </select>
          </label>
        </div>
      )}

      {/* FECHA */}
      {currentService && (
        <div className="booking-row">
          <label>
            Fecha
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
            />
          </label>
        </div>
      )}

      {/* HORAS */}
      {currentService && (
        <div className="booking-row">
          <p>Horas disponibles</p>

          {loadingSlots ? (
            <p>Cargando horarios...</p>
          ) : slots.length === 0 ? (
            <p>No hay huecos disponibles.</p>
          ) : (
            <div className="booking-slots">
              {slots.map(slot => {
                const isSelected = selectedTimeIso === slot.iso;
                return (
                  <button
                    key={slot.iso}
                    type="button"
                    className={`booking-slot-btn ${isSelected ? "is-selected" : ""}`}
                    onClick={() => setSelectedTimeIso(slot.iso)}
                  >
                    {slot.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* DATOS */}
      {selectedTimeIso && (
        <>
          <div className="booking-row">
            <label>
              Nombre
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Tu nombre"
              />
            </label>
          </div>

          <div className="booking-row">
            <label>
              Email
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="tuemail@ejemplo.com"
              />
            </label>
          </div>

          <div className="booking-row">
            <label>
              Notas (opcional)
              <input
                type="text"
                value={notes}
                onChange={e => setNotes(e.target.value)}
              />
            </label>
          </div>

          <div className="booking-actions">
            <button
              type="button"
              onClick={handleBook}
              disabled={!name || submitting}
            >
              {submitting
                ? "Reservando…"
                : `Confirmar reserva — ${currentService?.title}`}
            </button>
          </div>
        </>
      )}

      {/* STATUS */}
      <div style={{ minHeight: 28, marginTop: 12 }}>
        {bookingStatus === "ok" && <p className="booking-success">✅ Reserva realizada correctamente.</p>}
        {bookingStatus === "error" && <p className="booking-error">❌ Error al reservar. Inténtalo de nuevo.</p>}
      </div>

    </div>
  );
}
