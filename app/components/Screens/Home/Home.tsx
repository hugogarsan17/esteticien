"use client";

import React, { useState, useMemo } from "react";
import Navbar from "../../layouts/Navbar/navbar";
import "./Home.css";
import Cards from "../../cards/Cards";
import Whatsapp from "../../whatsapp/whatsapp";
import BookingWidget from "../../BookingWidget/BookingWidget";
import Footer from "../../layouts/Footer/Footer";

export default function Home() {
    const services = [
    {
      id: 1,
      img: "/tratamiento-facial.jpg",
      title: "Tratamientos Faciales",
      category: "Facial",
      desc: "Limpieza profunda, hidratación y tratamientos antiedad adaptados a tu tipo de piel.",
      price: 40,
    },
    {
      id: 2,
      img: "/TratamientosCorporales.jpg",
      title: "Tratamientos Corporales",
      category: "Corporal",
      desc: "Masajes remodelantes, drenaje y cuidado corporal para mejorar la circulación y la firmeza.",
      price: 45,
    },
    {
      id: 3,
      img: "/DepilacionLaser.jpg",
      title: "Depilación Láser",
      category: "Depilación",
      desc: "Depilación láser progresiva para reducir el vello de forma duradera y segura.",
      price: 45,
    },
    {
      id: 4,
      img: "/Maquillaje.jpg",
      title: "Maquillaje",
      category: "Maquillaje",
      desc: "Maquillaje social, de día o de noche, realzando tus rasgos sin perder tu esencia.",
      price: 70,
    },
    {
      id: 5,
      img: "/Manicura.jpg",
      title: "Manicura",
      category: "Uñas",
      desc: "Manicura clásica o semipermanente con acabado limpio, pulido y duradero.",
      price: 15,
    },
    {
      id: 6,
      img: "/Pedicura.png",
      title: "Pedicura",
      category: "Uñas",
      desc: "Cuidado completo de pies, limado, hidratación y esmaltado para una pisada perfecta.",
      price: 10,
    },
    {
      id: 7,
      img: "/DepilacionTradicional.jpg",
      title: "Depilación Tradicional",
      category: "Depilación",
      desc: "Depilación con cera para una piel suave y libre de vello durante semanas.",
      price: 20,
    },
    {
      id: 8,
      img: "/DisenodeCejas.jpg",
      title: "Diseño de Cejas",
      category: "Cejas y Pestañas",
      desc: "Diseño y perfilado de cejas para enmarcar tu mirada con armonía.",
      price: 25,
    },
    {
      id: 9,
      img: "/LiftingdePestana.jpg",
      title: "Lifting de Pestañas",
      category: "Cejas y Pestañas",
      desc: "Curvatura y definición de tus pestañas naturales para un efecto de mirada abierta.",
      price: 35,
    },
    {
      id: 10,
      img: "/Microblading.gif",
      title: "Microblading",
      category: "Cejas y Pestañas",
      desc: "Micropigmentación pelo a pelo para cejas definidas y naturales.",
      price: 180,
    },
    {
      id: 11,
      img: "/MasajesRelajantes.jpg",
      title: "Masajes Relajantes",
      category: "Masajes",
      desc: "Masajes suaves para aliviar tensiones, mejorar el descanso y bajar el estrés.",
      price: 45,
    },
  ];

   const categories = useMemo(
    () => ["Todos", ...Array.from(new Set(services.map((s) => s.category)))],
    [services]
  );

  const [activeCategory, setActiveCategory] = useState("Todos");

  const filteredServices = useMemo(
    () =>
      activeCategory === "Todos"
        ? services
        : services.filter((s) => s.category === activeCategory),
    [activeCategory, services]
  );
  return (
    <div>
      {/* Navbar directamente, sin wrapper con clase navbar-menu */}
      <Navbar />

      <div className="main-hero">
        <div className="main-title">
          <img src="logo-noback.png" alt="" />
          <h1></h1>
        </div>
        <div className="cta-section">
          <button className="contact" > <a href="/contact">Contactar </a></button>
          <button>Ver servicios</button>
        </div>
      </div>
      <div className="section about-us">
  <div className="section-title">
    <h2>About Us</h2>
  </div>

  <div className="section-content about-us-content">
    <div className="about-text">
      <h3>Tu espacio de belleza en calma</h3>
      <p>
        En Lucia Esdo creemos que la belleza empieza por sentirse bien. 
        Creamos un espacio íntimo y tranquilo donde cada detalle está pensado 
        para que desconectes, te mimes y salgas renovada.
      </p>
      <p>
        Trabajamos con productos seleccionados con cuidado y técnicas actuales, 
        siempre adaptadas a tu tipo de piel, tus rasgos y tu estilo de vida.
      </p>
      <p>
        Nuestro objetivo es sencillo: que te veas como tú, pero 
        en tu mejor versión.
      </p>
    </div>


<div className="about-highlight" role="region" aria-label="Experiencia y especialización">
  <div className="about-top">
    <span className="about-badge" aria-hidden="false">
      <svg className="badge-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
        <path d="M12 2l2.6 5.3L20 9l-4 3.6L17 20l-5-2.6L7 20l1-7.4L4 9l5.4-1.7L12 2z" fill="currentColor"/>
      </svg>
      +20 años de experiencia
    </span>

    <p className="about-small">
      Especializada en estética facial, cejas y tratamientos personalizados.
    </p>
  </div>

  <div className="about-meta">
    <dl>
      <div className="meta-item">
        <dt>Atención</dt>
        <dd>Individual y personalizada</dd>
      </div>
      <div className="meta-item">
        <dt>Ubicación</dt>
        <dd>Urb. Olivos-Locales, 16, 45280 Olías del Rey, Toledo</dd>
      </div>
    </dl>
  </div>
</div>

  </div>
</div>
  <div className="section service" id="services">
        <div className="section-title">
          <h2>Services</h2>
        </div>

        {/* Filtros por categoría */}
        <div className="service-filters">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`service-filter-btn ${
                activeCategory === cat ? "is-active" : ""
              }`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="section-content">
          {filteredServices.map((service) => (
            <Cards
              key={service.id}
              img={service.img}
              title={service.title}
              desc={service.desc}
              price={service.price}
            />
          ))}
        </div>
      </div>
<div className="section reservar" id="reservas">
  <div className="section-title">
    <h2>Reservas</h2>
  </div>
  <div className="section-content">
    <BookingWidget />
  </div>
</div>

            <Whatsapp />
            <Footer />
    </div>
  );
}
