export default function About() {
  return (
    <div className="page-container animate-fade-in">
      <div className="about-wrapper">

        {/* App identity */}
        <div className="about-hero glass-card">
          <div className="about-logo">🏭</div>
          <h1 className="about-app-name">NexIA VSM</h1>
          <span className="badge badge-accent about-badge">v1.0.0</span>
          <p className="about-description">
            Plataforma profesional de mapeo de flujo de valor basada en la metodología{' '}
            <strong>Value Stream Mapping</strong>. Diseña el estado actual y futuro de
            tus procesos, identifica desperdicios, analiza métricas de flujo y planifica
            iniciativas de mejora para lograr procesos más eficientes y alineados con
            la demanda del cliente.
          </p>
        </div>

        {/* Developer */}
        <div className="about-section glass-card">
          <p className="about-section-label">Desarrollado por</p>
          <p className="about-company-name">NexIA Soluciones</p>
          <a
            href="https://www.nexiasoluciones.com.mx"
            target="_blank"
            rel="noopener noreferrer"
            className="about-website-link"
          >
            www.nexiasoluciones.com.mx ↗
          </a>
        </div>

        {/* Contact */}
        <div className="about-section glass-card">
          <p className="about-section-label">¿Te interesa esta herramienta?</p>
          <p className="about-contact-desc">
            Escríbenos y con gusto te asesoramos sobre cómo NexIA puede
            impulsar el mapeo de flujo de valor en tu organización.
          </p>
          <a
            href="mailto:soporte@nexiasoluciones.com.mx?subject=Información sobre NexIA VSM"
            className="btn btn-primary about-contact-btn"
          >
            ✉️ Contactar a NexIA
          </a>
        </div>

        {/* Footer */}
        <p className="about-footer">
          © {new Date().getFullYear()} NexIA Soluciones · Todos los derechos reservados
        </p>

      </div>
    </div>
  );
}
