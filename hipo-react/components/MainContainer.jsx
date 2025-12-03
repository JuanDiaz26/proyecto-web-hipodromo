import React from "react";
import { Link } from "react-router-dom";
import Calendar from "./Calendar";
import "./MainContainer.css";

const MainContainer = () => {
  return (
    <main className="main-inicio">
      {/* Ícono de WhatsApp */}
      <a
        className="whatsapp-icon"
        href="https://wa.me/+5493812067808?text=Hola%20buenas,%20una%20consulta."
        target="_blank"
        rel="noopener noreferrer"
        title="Hace tu consulta mediante nuestro chat de whatsapp"
      >
        <i className="bi bi-whatsapp wp-icon"></i>
      </a>

      {/* Scroll de Novedades */}
<div className="container-scroll-novedad"> 
  <div className="novedades">
    {[
      "5 de Octubre de 2025",
      "5 de Octubre de 2025",
      "5 de Octubre de 2025",
      "5 de Octubre de 2025",
      "5 de Octubre de 2025",
    ].map((fecha, index) => (
      <div className="novedad" key={index}>
        <a className="enlace-novedad-scroll" href="https://drive.google.com/file/d/13NQvufW9xD2LKSJpDEzTwue8I2vZRpmi/view?usp=sharing" target="_blank"
          rel="noopener noreferrer">
          <strong>
            <i className="bi bi-info-circle-fill"></i> Próxima reunión:
          </strong>{" "}
          {fecha}
        </a>

        {/* Botón/Link PDF con espacio y estilo propio */}
        {/* <a
          className="pdf-link"
          href="https://drive.google.com/file/d/1L66XoVMZNm-LtU9_InkvwR63lfLBzLWd/view?usp=sharing"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Ver inscriptos 24/09/25 (abre en una pestaña nueva)"
        >
          <span>Ver inscriptos para la proxima reunión</span>
          <i className="bi bi-file-pdf-fill"></i>
        </a> */}
      </div>
    ))}
  </div>
</div>

      {/* CONTENEDOR PRINCIPAL: 2 COLUMNAS */}
      <div className="contenedorPrincipal">
        {/* COLUMNA IZQUIERDA: CARRUSEL */}
<div className="columnaIzquierda">
  <div className="contenedorCarousel">
    <div
      id="carouselExampleAutoplaying"
      className="carousel slide"
      data-bs-ride="carousel"
    >
      <div className="carousel-inner">

        {/* Slide 1 */}
        <div className="carousel-item active">
          <img
            src="/carousel-ricardo.jpg"
            className="d-block w-100"
            alt="Placa de carousel"
            loading="lazy"
          />
        </div>

        {/* Slide 2 */}
        <div className="carousel-item">
          <img
            src="/carousel-placa2.jpg"
            className="d-block w-100"
            alt="Placa de carousel"
            loading="lazy"
          />
        </div>

        {/* Slide 3 con CTA */}
        <div className="carousel-item inscriptos-slide">
          <img
            src="/carousel-placa3.webp"   // <-- renombrada como pediste
            className="d-block w-100"
            alt="Inscriptos Reunión - Ver detalle"
            loading="lazy"
          />
          {/* Botón/overlay sólo en esta slide */}
          <a
            href="https://drive.google.com/file/d/1L66XoVMZNm-LtU9_InkvwR63lfLBzLWd/view?usp=sharing" // <-- poné tu URL
            target="_blank"
            rel="noopener noreferrer"
            className="cta-overlay"
            title="Ver inscriptos completos"
          >
            Ver inscriptos
          </a>
        </div>

      </div>

      <button className="carousel-control-prev" type="button"
        data-bs-target="#carouselExampleAutoplaying" data-bs-slide="prev">
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Anterior</span>
      </button>
      <button className="carousel-control-next" type="button"
        data-bs-target="#carouselExampleAutoplaying" data-bs-slide="next">
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Siguiente</span>
      </button>
    </div>
  </div>
</div>
        {/* COLUMNA DERECHA: CALENDARIO + BOTONES */}
        <div className="columnaDerecha">
          <h2 className="titulo-seccion titulo-derecha">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="25"
              height="25"
              fill="currentColor"
              className="bi bi-record-fill punto-color-titulo"
              viewBox="0 0 16 16"
            >
              <path
                fillRule="evenodd"
                d="M8 13A5 5 0 1 0 8 3a5 5 0 0 0 0 10z"
              />
            </svg>
            Calendario de Carreras
          </h2>

          <Calendar />

          <div className="contenedorHipica">
            <h2 className="titulo-seccion titulo-derecha">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="25"
                fill="currentColor"
                className="bi bi-record-fill punto-color-titulo"
                viewBox="0 0 16 16"
              >
                <path
                  fillRule="evenodd"
                  d="M8 13A5 5 0 1 0 8 3a5 5 0 0 0 0 10z"
                />
              </svg>
              Hípica
            </h2>

            <div className="contenedor-botones-inicio">
              <Link
                to="/estadisticas"
                className="cardHipica"
                id="CardHipicaEstadisticas"
              >
                <div className="cardHipica-content">
                  <span className="cardHipica-date">
                    <i className="bi bi-card-list"></i> DESDE EL 16 DE FEBRERO,
                    2025
                  </span>
                  <h3>Estadísticas al día</h3>
                </div>
              </Link>

              <Link
                to="/resultados"
                className="cardHipica"
                id="CardHipicaResultados"
              >
                <div className="cardHipica-content">
                  <span className="cardHipica-date">
                    <i className="bi bi-bar-chart"></i> DOMINGO 7 DE SEPTIEMBRE,
                    2025
                  </span>
                  <h3>Resultados por reunión</h3>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default MainContainer;
