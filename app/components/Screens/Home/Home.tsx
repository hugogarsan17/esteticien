"use client";

import React, { useState, useMemo } from "react";
import Navbar from "../../layouts/Navbar/navbar";
import "./Home.css";
import Cards from "../../cards/Cards";
import Whatsapp from "../../whatsapp/whatsapp";
import BookingWidget from "../../BookingWidget/BookingWidget";
import Footer from "../../layouts/Footer/Footer";

interface Service {
  id: number;
  img: string;
  title: string;
  category: string;
  desc: string;
  price: number;
}

export default function Home() {
  const services: Service[] = [
    { id: 1, img: "/tratamiento-facial.jpg", title: "Tratamientos Faciales", category: "Facial", desc: "Limpieza profunda, hidratación y tratamientos antiedad adaptados.", price: 40 },
    { id: 2, img: "/TratamientosCorporales.jpg", title: "Tratamientos Corporales", category: "Corporal", desc: "Masajes remodelantes, drenaje y cuidado corporal.", price: 45 },
    { id: 3, img: "/DepilacionLaser.jpg", title: "Depilación Láser", category: "Depilación", desc: "Depilación láser progresiva y segura.", price: 45 },
    { id: 4, img: "/Maquillaje.jpg", title: "Maquillaje", category: "Maquillaje", desc: "Maquillaje social, día o noche.", price: 70 },
    { id: 5, img: "/Manicura.jpg", title: "Manicura", category: "Uñas", desc: "Manicura clásica o semipermanente.", price: 15 },
    { id: 6, img: "/Pedicura.png", title: "Pedicura", category: "Uñas", desc: "Cuidado de pies, hidratación y esmaltado.", price: 10 },
    { id: 7, img: "/DepilacionTradicional.jpg", title: "Depilación Tradicional", category: "Depilación", desc: "Depilación con cera para semanas sin vello.", price: 20 },
    { id: 8, img: "/DisenodeCejas.jpg", title: "Diseño de Cejas", category: "Cejas y Pestañas", desc: "Diseño y perfilado de cejas.", price: 25 },
    { id: 9, img: "/LiftingdePestana.jpg", title: "Lifting de Pestañas", category: "Cejas y Pestañas", desc: "Curvatura y definición natural.", price: 35 },
    { id: 10, img: "/Microblading.gif", title: "Microblading", category: "Cejas y Pestañas", desc: "Micropigmentación pelo a pelo.", price: 180 },
    { id: 11, img: "/MasajesRelajantes.jpg", title: "Masajes Relajantes", category: "Masajes", desc: "Masajes suaves para aliviar tensiones.", price: 45 },
  ];

  const categories = useMemo(
    () => ["Todos", ...Array.from(new Set(services.map((s) => s.category)))],
    [services]
  );

  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [activeCategory, setActiveCategory] = useState("Todos");

  const filteredServices = useMemo(
    () => activeCategory === "Todos" ? services : services.filter((s) => s.category === activeCategory),
    [activeCategory, services]
  );

  const handleSelectService = (service: Service) => {
    setSelectedService(service);

    const el = document.getElementById("reservas");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div>
      <Navbar />

      {/* HERO */}
      <div className="main-hero">
        <div className="main-title">
          <img src="logo-noback.png" alt="" />
        </div>
        <div className="cta-section">
          <button>Ver servicios</button>
        </div>
      </div>

      {/* SERVICES */}
      <div className="section service" id="services">
        <div className="section-title">
          <h2>Services</h2>
        </div>

        <div className="service-filters">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`service-filter-btn ${activeCategory === cat ? "is-active" : ""}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="section-content">
          {filteredServices.map((s) => (
            <Cards
              key={s.id}
              img={s.img}
              title={s.title}
              desc={s.desc}
              price={s.price}
              onClick={() => handleSelectService(s)}
            />
          ))}
        </div>
      </div>

      {/* RESERVAS */}
      <div className="section reservar" id="reservas">
        <div className="section-title"><h2>Reservas</h2></div>

        <BookingWidget selectedService={selectedService} />
      </div>

      <Whatsapp />
      <Footer />
    </div>
  );
}
