import React from "react";
import "./HeaderInicio.css";
import Navbar from "./Navbar"; // Importamos el nuevo componente

const HeaderInicio = () => {
  return (
    <header id="header-inicio">
      <video
        autoPlay
        muted
        loop
        playsInline
        className="video-fondo"
      >
        <source src="/video-portada.mp4" type="video/mp4" />
      </video>
      <div className="capa"></div>

      {/* NAVBAR REUTILIZABLE */}
      <Navbar variant="inicio" />

      {/* CENTRO VIDEO */}
      <div className="contenedor-centro-video">
        <a className="navbar-brand" href="/">
          <img
            className="logo-visible"
            src="/logohipoblanco.png"  // <-- desde public/
            alt="Logo HipodromodeTucuman"
            loading="lazy"
          />
        </a>
        <br />
        <div className="contenedorBotonesCentro">
          <a
            href="https://hiptuc.netlify.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="button"
            id="buttonApp"
          >
            <div className="button-wrapper">
              <div className="text">
                <i className="bi bi-google-play iconoBotonCentro"></i>App de
                apuestas
              </div>
              <span className="icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="2em"
                  height="2em"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 15V3m0 12l-4-4m4 4l4-4M2 17l.621 2.485A2 2 0 0 0 4.561 21h14.878a2 2 0 0 0 1.94-1.515L22 17"
                  />
                </svg>
              </span>
            </div>
          </a>

          <a
            href="https://drive.google.com/file/d/1XUej832-cpyD6P2OFq_PApzg0cYWl5zj/view?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            className="button"
            id="buttonPrograma"
          >
            <div className="button-wrapper">
              <div className="text">
                <i className="bi bi-newspaper iconoBotonCentro"></i>Programa
                Oficial
              </div>
              <span className="icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="2em"
                  height="2em"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 15V3m0 12l-4-4m4 4l4-4M2 17l.621 2.485A2 2 0 0 0 4.561 21h14.878a2 2 0 0 0 1.94-1.515L22 17"
                  />
                </svg>
              </span>
            </div>
          </a>
        </div>
      </div>

      {/* REDES SOCIALES */}
      <div className="redes-inicio">
        <a
          href="https://www.facebook.com/hipodromotuc"
          target="_blank"
          rel="noreferrer"
        >
          <i className="bi bi-facebook"></i>
        </a>
        <a
          href="https://wa.me/+5493812067808?text=Hola%20buenas,%20una%20consulta."
          target="_blank"
          rel="noreferrer"
        >
          <i className="bi bi-whatsapp"></i>
        </a>
        <a
          href="https://www.instagram.com/hipodromodetucuman/"
          target="_blank"
          rel="noreferrer"
        >
          <i className="bi bi-instagram"></i>
        </a>
        <a
          href="https://www.youtube.com/@HipodromodeTucuman"
          target="_blank"
          rel="noreferrer"
        >
          <i className="bi bi-youtube"></i>
        </a>
      </div>
    </header>
  );
};

export default HeaderInicio;
