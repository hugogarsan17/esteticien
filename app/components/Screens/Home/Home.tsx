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
  // ================= FACIALES =================
  {
    id: 1,
    category: "Tratamientos Faciales",
    subcategory: "Higiene Facial",
    title: "Higiene facial",
    price: 40,
    img: "/tratamiento-facial.jpg",
    desc: "Limpieza profunda adaptada a tu tipo de piel.",
  },
  {
    id: 2,
    category: "Tratamientos Faciales",
    subcategory: "Higiene + Ácidos",
    title: "Higiene + tratamiento de ácidos",
    price: 55,
    img: "/acidos.jpg",
    desc: "Limpieza facial combinada con ácidos específicos.",
  },
  {
    id: 3,
    category: "Tratamientos Faciales",
    subcategory: "Rejuvenecimiento",
    title: "Tratamiento Derma IR",
    price: 60,
    img: "/dermair.jpg",
    desc: "Rejuvenecimiento facial con tecnología Derma IR.",
  },
  {
    id: 4,
    category: "Tratamientos Faciales",
    subcategory: "Rejuvenecimiento",
    title: "Radiofrecuencia facial",
    price: 50,
    img: "/tratamiento-facial.jpg",
    desc: "Estimulación del colágeno y reafirmación.",
  },

  // ================= CORPORALES =================
  {
    id: 5,
    category: "Tratamientos Corporales",
    subcategory: "Reductores",
    title: "Lipo-láser",
    price: 45,
    img: "/lipolaser.png",
    desc: "Reducción localizada y modelado corporal.",
  },
  {
    id: 6,
    category: "Tratamientos Corporales",
    subcategory: "Circulatorios",
    title: "Presoterapia",
    price: 40,
    img: "/Presoterapia.png",
    desc: "Mejora la circulación y reduce retención de líquidos.",
  },
  {
    id: 7,
    category: "Tratamientos Corporales",
    subcategory: "Reafirmantes",
    title: "Diatermia",
    price: 55,
    img: "/TratamientosCorporales.jpg",
    desc: "Reafirma y tonifica la piel.",
  },
  {
    id: 8,
    category: "Tratamientos Corporales",
    subcategory: "Reductores",
    title: "Masaje reductor",
    price: 45,
    img: "/masaje reductor.png",
    desc: "Masaje intenso para moldear la figura.",
  },

  // ================= MAQUILLAJE =================
  {
    id: 9,
    category: "Maquillaje",
    subcategory: "Social",
    title: "Maquillaje",
    price: 70,
    img: "./Maquillaje.jpg",
    desc: "Maquillaje profesional personalizado.",
  },
  {
    id: 10,
    category: "Maquillaje",
    subcategory: "Bodas",
    title: "Maquillaje novia",
    price: 120,
    img: "./maquillaje boda.png",
    desc: "Maquillaje especial para el día de tu boda.",
  },
  {
    id: 11,
    category: "Maquillaje",
    subcategory: "Bodas",
    title: "Pack de boda",
    price: 0,
    img: "/pack-boda.png",
    desc: "Novia, madrina e invitadas.",
  },
  {
    id: 12,
    category: "Maquillaje",
    subcategory: "Eventos",
    title: "Maquillaje de fiesta",
    price: 80,
    img: "/maquillaje fiesta.png",
    desc: "Ideal para eventos y celebraciones.",
  },
  {
    id: 13,
    category: "Maquillaje",
    subcategory: "A domicilio",
    title: "Maquillaje a domicilio",
    price: 0,
    img: "/Maquillaje.jpg",
    desc: "Servicio de maquillaje en tu domicilio.",
  },

  // ================= PESTAÑAS =================
  {
    id: 14,
    category: "Pestañas",
    subcategory: "Lifting",
    title: "Lifting de pestañas + tinte",
    price: 35,
    img: "/LiftingdePestana.jpg",
    desc: "Curvatura y color para una mirada abierta.",
  },
  {
    id: 15,
    category: "Pestañas",
    subcategory: "Tinte",
    title: "Tinte de pestañas",
    price: 20,
    img: "/LiftingdePestana.jpg",
    desc: "Color intenso y duradero.",
  },
  {
    id: 16,
    category: "Pestañas",
    subcategory: "Tinte",
    title: "Tinte de cejas",
    price: 20,
    img: "/DisenodeCejas.jpg",
    desc: "Define y realza tus cejas.",
  },

  // ================= MANICURA =================
  {
    id: 17,
    category: "Manicura",
    subcategory: "Esmaltado",
    title: "Manicura esmalte normal",
    price: 15,
    img: "/Manicura.jpg",
    desc: "Manicura clásica.",
  },
  {
    id: 18,
    category: "Manicura",
    subcategory: "Esmaltado",
    title: "Manicura semipermanente",
    price: 20,
    img: "/Manicura.jpg",
    desc: "Esmaltado duradero.",
  },
  {
    id: 19,
    category: "Manicura",
    subcategory: "Uñas artificiales",
    title: "Uñas acrílicas",
    price: 35,
    img: "/Manicura.jpg",
    desc: "Extensión y diseño.",
  },

  // ================= PEDICURA =================
  {
    id: 20,
    category: "Pedicura",
    subcategory: "Básica",
    title: "Pedicura completa",
    price: 25,
    img: "/Pedicura.png",
    desc: "Cuidado completo de pies.",
  },

  // ================= DEPILACIÓN =================
  {
    id: 21,
    category: "Depilación",
    subcategory: "Láser",
    title: "Láser de diodo",
    price: 45,
    img: "/DepilacionLaser.jpg",
    desc: "Depilación láser eficaz.",
  },
  {
    id: 22,
    category: "Depilación",
    subcategory: "Cera",
    title: "Depilación facial con cera",
    price: 15,
    img: "/DepilacionTradicional.jpg",
    desc: "Labio, cejas y rostro.",
  },
];
const [activeSubcategory, setActiveSubcategory] = useState("Todas");
const [activeCategory, setActiveCategory] = useState("Todas");


const categories = useMemo(
  () => ["Todas", ...new Set(services.map(s => s.category))],
  [services]
);

const subcategories = useMemo(() => {
  if (activeCategory === "Todas") return [];

  return [
    "Todas",
    ...new Set(
      services
        .filter(s => s.category === activeCategory)
        .map(s => s.subcategory)
    ),
  ];
}, [activeCategory, services]);

const filteredServices = useMemo(() => {
  return services.filter(s => {
    if (activeCategory !== "Todas" && s.category !== activeCategory) return false;
    if (activeSubcategory !== "Todas" && s.subcategory !== activeSubcategory) return false;
    return true;
  });
}, [activeCategory, activeSubcategory, services]);

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
       {/* Categorías */}
<div className="service-filters">
  {categories.map(cat => (
    <button
      key={cat}
      className={`service-filter-btn ${activeCategory === cat ? "is-active" : ""}`}
      onClick={() => {
        setActiveCategory(cat);
        setActiveSubcategory("Todas"); // reset
      }}
    >
      {cat}
    </button>
  ))}
</div>

{/* Subcategorías */}
{activeCategory !== "Todas" && (
  <div className="service-subfilters">
    {subcategories.map(sub => (
      <button
        key={sub}
        className={activeSubcategory === sub ? "is-active" : ""}
        onClick={() => setActiveSubcategory(sub)}
      >
        {sub}
      </button>
    ))}
  </div>
)}
<div className="section-content">
  {filteredServices.map(service => (
    <Cards
      key={service.id}
      img={service.img}
      title={service.title}
      desc={service.desc}
      price={service.price}
    />
  ))}
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
    </div>
  );
}
