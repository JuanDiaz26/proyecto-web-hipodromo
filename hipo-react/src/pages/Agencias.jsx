import React from "react";
import Navbar from "../../components/Navbar";
import "./TablasPages.css";

// Importamos las imágenes (asegúrate de que las rutas sean correctas en tu proyecto)
import ubicacionColor from "../assets/ubicacion-color.png";
import caballoBlanco from "../assets/caballo-blanco.png";

const Agencias = () => {
  return (
    <>
      <header className="header-pages">
        <div className="navbar-wrapper">
            <Navbar />
        </div>
      </header>

      <main className="main-inicio main-pages">
        {/* Botón Flotante WhatsApp */}
        <a
          className="whatsapp-icon whatsapp-icon-page1"
          href="https://wa.me/+5493812067808?text=Hola%20buenas,%20una%20consulta."
          target="_blank"
          rel="noreferrer"
          title="Hace tu consulta mediante nuestro chat de whatsapp"
        >
          <i className="bi bi-whatsapp wp-icon"></i>
        </a>

        <div className="container-titulo-pages">
          {/* Título con estilo unificado */}
          <h3 className="titulo-pages titulo-programas">
            {/* Icono de Ubicación / Pin */}
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-geo-alt-fill punto-color-titulo" viewBox="0 0 16 16">
              <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/>
            </svg>
            AGENCIAS
          </h3>
        </div>

        <div className="separador-pages"></div>

        <div className="container-agencias" style={{ paddingBottom: '50px' }}>
          {/* Tarjeta del Mapa (Estilos definidos en el CSS nuevo) */}
          <div className="map-card">
            <div className="map-header">
              <p className="descripcion-mapa">
                Elegí tu agencia más cómoda a la hora de jugar
              </p>
            </div>

            <div className="map-wrapper">
              <iframe
                className="map-embed"
                src="https://www.google.com/maps/d/embed?mid=1rIMAV8UP-Tx-pRr32uf7Vgjk0i_Mcok&ehbc=2E312F"
                title="Mapa agencias"
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>

            {/* Leyenda de Iconos */}
            <div className="legend-grid">
              <div className="legend-item">
                <img
                  className="legend-icon legend-ubicacion"
                  src={ubicacionColor}
                  alt="Hipódromo de Tucumán"
                  loading="lazy"
                />
                <strong>Hipódromo de Tucumán</strong>
              </div>

              <div className="legend-item">
                <img
                  className="legend-icon legend-congreso"
                  src={caballoBlanco}
                  alt="Agencia sucursal Congreso"
                  loading="lazy"
                />
                <strong>Agencia sucursal Congreso</strong>
              </div>

              <div className="legend-item">
                <img
                  className="legend-icon legend-mitre"
                  src={caballoBlanco}
                  alt="Agencia sucursal Mitre"
                  loading="lazy"
                />
                <strong>Agencia sucursal Mitre</strong>
              </div>
            </div>

            {/* Botones de Acción del Mapa */}
            <div className="map-actions">
              <a
                className="btn-map"
                href="https://www.google.com/maps/d/viewer?mid=1rIMAV8UP-Tx-pRr32uf7Vgjk0i_Mcok"
                target="_blank"
                rel="noreferrer"
                aria-label="Abrir mapa en Google Maps"
              >
                <i className="bi bi-geo-alt-fill"></i>
                Abrir en Google Maps
              </a>
              <a
                className="btn-map btn-outline"
                href="https://www.google.com/maps/search/?api=1&query=Hip%C3%B3dromo%20de%20Tucum%C3%A1n"
                target="_blank"
                rel="noreferrer"
                aria-label="Cómo llegar al Hipódromo de Tucumán"
              >
                <i className="bi bi-signpost-fill"></i>
                Cómo llegar al Hipódromo
              </a>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Agencias;