import React from "react";
import Navbar from "../../components/Navbar";
import "./TablasPages.css";

// ✅ Importá todas las imágenes desde src/assets
import imgGanador     from "../assets/ganador.webp";
import imgExacta      from "../assets/exacta.webp";
import imgImperfecta  from "../assets/imperfecta.webp";
import imgTrifecta    from "../assets/trifecta.webp";
import imgCuatrifecta from "../assets/cuatrifecta.webp";
import imgDoble       from "../assets/doble.webp";
import imgTriplo      from "../assets/triplo.webp";
import imgCuaterna    from "../assets/cuaterna.webp";
import imgQuintuplo   from "../assets/quintuplo.webp";
import imgCadena      from "../assets/cadena.webp";

const tipos = [
  {
    img: imgGanador,
    alt: "imagen apuesta a ganador",
    texto: <>Si el caballo que elegís llega en <strong className="strongTiposAp">1º lugar</strong> ganás</>,
  },
  {
    img: imgExacta,
    alt: "imagen exacta",
    texto: (
      <>
        Si seleccionás <strong className="strongTiposAp">2 caballos</strong> que lleguen en{" "}
        <strong className="strongTiposAp">1º y 2º lugar</strong> en orden exacto ganás la apuesta
      </>
    ),
  },
  {
    img: imgImperfecta,
    alt: "imagen imperfecta",
    texto: (
      <>
        Debés elegir <strong className="strongTiposAp">2 caballos</strong> que lleguen en{" "}
        <strong className="strongTiposAp">1º y 2º lugar</strong> sin importar el orden
      </>
    ),
  },
  {
    img: imgTrifecta,
    alt: "imagen trifecta",
    texto: (
      <>
        Ganás si escogés <strong className="strongTiposAp">3 caballos</strong> que lleguen en{" "}
        <strong className="strongTiposAp">1º, 2º y 3º lugar</strong> en orden exacto
      </>
    ),
  },
  {
    img: imgCuatrifecta,
    alt: "imagen cuatrifecta",
    texto: (
      <>
        Ganás si seleccionás <strong className="strongTiposAp">4 caballos</strong> y llegan en{" "}
        <strong className="strongTiposAp">1º, 2º, 3º y 4º lugar</strong> en orden exacto
      </>
    ),
  },
  {
    img: imgDoble,
    alt: "imagen doble",
    texto: (
      <>
        Si escogés <strong className="strongTiposAp">2 caballos</strong> de{" "}
        <strong className="strongTiposAp">2 carreras consecutivas</strong> y llegan en{" "}
        <strong className="strongTiposAp">1º lugar</strong> ganás la apuesta doble
      </>
    ),
  },
  {
    img: imgTriplo,
    alt: "imagen triplo",
    texto: (
      <>
        Si seleccionás <strong className="strongTiposAp">3 caballos</strong> de{" "}
        <strong className="strongTiposAp">3 carreras consecutivas</strong> y llegan en{" "}
        <strong className="strongTiposAp">1º lugar</strong> ganás la apuesta triplo
      </>
    ),
  },
  {
    img: imgCuaterna,
    alt: "imagen cuaterna",
    texto: (
      <>
        Si seleccionás <strong className="strongTiposAp">4 caballos</strong> de{" "}
        <strong className="strongTiposAp">4 carreras consecutivas</strong> y llegan en{" "}
        <strong className="strongTiposAp">1º lugar</strong> ganás la apuesta cuaterna
      </>
    ),
  },
  {
    img: imgQuintuplo,
    alt: "imagen quintuplo",
    texto: (
      <>
        Si seleccionás <strong className="strongTiposAp">5 caballos</strong> de{" "}
        <strong className="strongTiposAp">5 carreras consecutivas</strong> y llegan en{" "}
        <strong className="strongTiposAp">1º lugar</strong> ganás la apuesta quintuplo
      </>
    ),
  },
  {
    img: imgCadena,
    alt: "imagen cadena",
    texto: (
      <>
        Si seleccionás <strong className="strongTiposAp">6 caballos</strong> de{" "}
        <strong className="strongTiposAp">6 carreras consecutivas</strong> y llegan en{" "}
        <strong className="strongTiposAp">1º lugar</strong> ganás la apuesta cadena
      </>
    ),
  },
];

const TiposApuestas = () => {
  return (
    <>
      <header className="header-pages">
        <div className="navbar-wrapper">
            <Navbar />
        </div>
      </header>

      <main className="main-inicio main-pages">
        {/* Botón flotante WhatsApp */}
        <a
          className="whatsapp-icon whatsapp-icon-page1"
          href="https://wa.me/+5493812067808?text=Hola%20buenas,%20una%20consulta."
          target="_blank"
          rel="noopener noreferrer"
          title="Hace tu consulta mediante nuestro chat de whatsapp"
        >
          <i className="bi bi-whatsapp wp-icon"></i>
        </a>

        <div className="container-titulo-pages">
          {/* Clase titulo-programas agregada para mantener el estilo */}
          <h3 className="titulo-pages titulo-programas">
            {/* Icono de Cuadrícula / Tipos */}
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-ui-checks-grid punto-color-titulo" viewBox="0 0 16 16">
              <path d="M2 10h3a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1zm9-9h3a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-3a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zm0 9a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1h-3zm0-10a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h3a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2h-3zM2 9a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h3a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H2zm7 2a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-3a2 2 0 0 1-2-2v-3zM0 2a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm5.354.854a.5.5 0 1 0-.708-.708L3 3.793l-.646-.647a.5.5 0 1 0-.708.708l1 1a.5.5 0 0 0 .708 0l2-2z"/>
            </svg>
            TIPOS DE APUESTAS
          </h3>
        </div>

        <div className="separador-pages"></div>

        <div className="container-como-apostar">
          <div className="row row-cols-1 row-cols-md-3 g-4">
            {tipos.map((tipo, i) => (
              <div className="col" key={i}>
                {/* Tarjeta estilizada con bordes redondeados y sombra */}
                <div className="card h-100 border-0 shadow-sm" style={{ borderRadius: '12px', overflow: 'hidden' }}>
                  
                  {/* Contenedor centrado para la imagen */}
                  <div className="text-center pt-3">
                    <img
                      src={tipo.img}
                      className="img-como-apostar"
                      alt={tipo.alt}
                      loading="lazy"
                      style={{ maxWidth: '100%', objectFit: 'contain' }}
                    />
                  </div>

                  <div className="card-body card-body-como-apostar d-flex align-items-center justify-content-center">
                    <p className="card-text" style={{ fontSize: '0.95rem' }}>
                        {tipo.texto}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
};

export default TiposApuestas;