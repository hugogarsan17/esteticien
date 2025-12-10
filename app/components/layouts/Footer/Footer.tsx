import React from "react";
import "./Footer.css";

type LinkItem = { label: string; href: string };
type FooterProps = {
  companyName?: string;
  logoSrc?: string;
  links?: LinkItem[];
  services?: string[];
  address?: string;
  email?: string;
  phone?: string;
};

export default function Footer({
  companyName = "Lucia ESDO",
  logoSrc = "/logo.png",
  links = [
    { label: "Inicio", href: "/" },
    { label: "Servicios", href: "/servicios" },
  ],
  services = ["Tratamientos Faciales", "Depilación Láser", "Masajes", "Uñas"],
  address = "Urb. Olivos-Locales, 16, 45280 Olías del Rey, Toledo",
  email = "hola@esteticaejemplo.com",
  phone = "+34 678 63 87 87",
}: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer" role="contentinfo">
      <div className="footer-inner">
        <div className="footer-brand">
          <a href="/" className="brand-link" aria-label={`${companyName} - Inicio`}>
            <div className="brand-text">
              <span className="brand-title">{companyName}</span>
              <small className="brand-tag">Belleza con cita</small>
            </div>
          </a>

          <p className="brand-desc">
            Tratamientos personalizados y atención profesional. Reserva tu cita y vive la experiencia.
          </p>

          <div className="socials" aria-hidden={false}>
            <a aria-label="Facebook" href="#" className="social-btn">
              {/* simple svg icon */}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M22 12.07C22 6.48 17.52 2 11.93 2S2 6.48 2 12.07c0 4.99 3.66 9.13 8.44 9.93v-7.03H7.9v-2.9h2.54V9.41c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.23.2 2.23.2v2.46h-1.25c-1.23 0-1.61.77-1.61 1.56v1.88h2.74l-.44 2.9h-2.3V22C18.34 21.2 22 17.06 22 12.07z"/>
              </svg>
            </a>
            <a aria-label="Instagram" href="#" className="social-btn">
<svg width="20" height="20" viewBox="0 0 24 24" fill="none">
  <rect x="3" y="3" width="18" height="18" rx="5" strokeWidth="currentColor" stroke-width="2"/>
  <circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="2"/>
  <circle cx="17" cy="7" r="1.3" fill="currentColor"/>
</svg>

            </a>

          </div>
        </div>

        <nav className="footer-links" aria-label="Enlaces del pie de página">
          <div className="links-block">
            <h4 className="links-title">Enlaces</h4>
            <ul>
              {links.map((l) => (
                <li key={l.href}><a href={l.href}>{l.label}</a></li>
              ))}
            </ul>
          </div>

          <div className="links-block">
            <h4 className="links-title">Servicios</h4>
            <ul>
              {services.map((s) => (
                <li key={s}><a href={`/servicios#${s.replace(/\s+/g, "-").toLowerCase()}`}>{s}</a></li>
              ))}
            </ul>
          </div>

          <div className="links-block">
            <h4 className="links-title">Contacto</h4>
            <address className="footer-address">
              <div className="addr-line">{address}</div>
              <div><a href={`mailto:${email}`}>{email}</a></div>
              <div><a href={`tel:${phone}`}>{phone}</a></div>
            </address>
          </div>
        </nav>
      </div>

      <div className="footer-bottom">
        <div className="copy">© {year} {companyName}. Todos los derechos reservados.</div>
        <div className="policies">
          <a href="/politica-privacidad">Política de privacidad</a>
          <a href="/terminos">Términos</a>
        </div>
      </div>
    </footer>
  );
}
