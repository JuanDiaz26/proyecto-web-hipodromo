import React from "react";
import Navbar from "../../components/Navbar";
import "./TablasPages.css";

// ✅ Importá las imágenes desde src/assets (ojo con MAY/min)
import paso1 from "../assets/paso1.webp";
import paso2 from "../assets/paso2.webp";
import paso3 from "../assets/paso3.webp";
import paso4 from "../assets/paso4.webp";
import paso5 from "../assets/paso5.webp";
import paso6 from "../assets/paso6.webp";
import paso7 from "../assets/paso7.webp";

const ComoApostar = () => {
  const pasos = [
    {
      numero: 1,
      texto: "Por call center te enviaremos el link ejecutable de la aplicación",
      img: paso1,
    },
    {
      numero: 2,
      texto:
        'Ingresar al navegador y presionar "Agrega Hip. Tucumán a la pantalla principal" o presionar "Instalar aplicación"',
      img: paso2,
    },
    {
      numero: 3,
      texto: "Instalado se mostrará el siguiente aviso:",
      img: paso3,
      extraClass: "img-paso3grande",
    },
    {
      numero: 4,
      texto: "En la pantalla del dispositivo se observará el acceso directo de la aplicación",
      img: paso4,
    },
    {
      numero: 5,
      texto: "Si no tiene usuario debe registrarse",
      img: paso5,
    },
    {
      numero: 6,
      texto: "Aquí tiene un ejemplo para completar el registro",
      img: paso6,
    },
    {
      numero: 7,
      texto:
        "Una vez creada la cuenta ingresamos al e-mail con el cual nos registramos, buscamos el mail de activación e ingresamos nuevamente al link de la app",
      img: paso7,
    },
  ];

  return (
    <>
      <header className="header-pages">
        <div className="navbar-wrapper">
            <Navbar />
        </div>
      </header>

      <main className="main-inicio main-pages">
        <a
          className="whatsapp-icon whatsapp-icon-page1"
          href="https://wa.me/+5493812067808?text=Hola%20buenas,%20una%20consulta."
          target="_blank"
          rel="noreferrer"
          title="Hace tu consulta mediante nuestro chat de whatsapp"
        >
          <i className="bi bi-whatsapp wp-icon"></i>
        </a>

        {/* TÍTULO PRINCIPAL */}
        <div className="container-titulo-pages">
          <h3 className="titulo-pages titulo-programas">
            {/* Icono de Pregunta / Ayuda */}
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-question-circle-fill punto-color-titulo" viewBox="0 0 16 16">
              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.496 6.033h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286a.237.237 0 0 0 .241.247zm2.325 6.443c.61 0 1.029-.394 1.029-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94 0 .533.425.927 1.01.927z"/>
            </svg>
            CÓMO APOSTAR?
          </h3>
        </div>

        <div className="separador-pages"></div>

        {/* SECCIÓN DE BOTONES */}
        <div className="container-button-app">
          <strong className="titulos-descargar-call">
            Descargá la aplicación desde el siguiente link:
          </strong>
          <a
            href="https://hiptuc.netlify.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="button buttonWpApostar"
            id="buttonDownloadApp"
          >
            <span className="button-content button-est">
              <i className="bi bi-download" style={{ marginRight: '8px' }}></i> Descargar
            </span>
          </a>

          <strong className="titulos-descargar-call" style={{ marginTop: '20px' }}>
            O solicita la app desde nuestro call center
          </strong>

          <a
            href="https://wa.me/+5493812067808?text=Hola%20buenas,%20una%20consulta."
            target="_blank"
            rel="noopener noreferrer"
            className="button buttonWpApostar"
            id="buttonCallCenter"
          >
            <span className="button-content button-est">
              <i className="bi bi-whatsapp" style={{ marginRight: '8px' }}></i> Call Center
            </span>
          </a>

          {/* SECCIÓN PASO A PASO */}
          <div className="pasos">
            <div className="container-titulo-pages" style={{ paddingTop: '40px' }}>
                <h3 className="titulo-pages titulo-programas">
                {/* Icono de Lista / Pasos */}
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-list-ol punto-color-titulo" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M5 11.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5z"/>
                    <path d="M1.713 11.865v-.474H2c.217 0 .363-.137.363-.317 0-.185-.158-.31-.361-.31-.223 0-.367.152-.373.31h-.59c.016-.467.373-.787.986-.787.588-.002.954.291.957.703a.595.595 0 0 1-.492.594v.033a.615.615 0 0 1 .569.631c.003.533-.502.8-1.051.8-.656 0-1-.37-1.008-.794h.582c.008.178.186.306.422.309.254 0 .424-.145.422-.35-.002-.195-.155-.348-.414-.348h-.3zm-.004-4.699h-.604v-.035c0-.408.295-.844.958-.844.583 0 .96.326.96.756 0 .389-.257.617-.476.848l-.537.572v.03h1.054V9H1.143v-.395l.957-.99c.138-.142.293-.304.293-.508 0-.18-.147-.32-.342-.32a.33.33 0 0 0-.342.338v.041zM2.564 5h-.635V2.924h-.39V2.507h1.025V5z"/>
                </svg>
                PASO A PASO
                </h3>
            </div>

            <div className="separador-pages"></div>

            <div className="container-paso-a-paso">
              {pasos.map((paso) => (
                <div className="paso-a-paso" key={paso.numero}>
                  <i className={`bi bi-${paso.numero}-circle pasos-numeros`}></i>
                  <span className="titulos-pasos">{paso.texto}</span>
                  <img
                    className={`img-pasos ${paso.extraClass || ""}`}
                    src={paso.img}
                    alt={`Paso ${paso.numero}`}
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default ComoApostar;