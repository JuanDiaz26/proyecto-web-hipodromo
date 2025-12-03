import React from "react";
import Navbar from "../../components/Navbar";
import "./TablasPages.css";

// Importación de imágenes (3 en total)
import escuela1 from "../assets/escuela-1.webp";
import escuela2 from "../assets/escuela-2.webp";
import escuela3 from "../assets/escuela-3.webp";

const Escuela = () => {
  return (
    <>
      <header className="header-pages">
        <Navbar />
      </header>

      <main className="main-inicio main-pages">
        <a
          className="whatsapp-icon whatsapp-icon-page1"
          href="https://wa.me/+5493812067808?text=Hola%20buenas,%20una%20consulta."
          target="_blank"
          rel="noopener noreferrer"
          title="Visita nuestra página de Whatsapp"
        >
          <i className="bi bi-whatsapp wp-icon"></i>
        </a>

        <div className="container-titulo-pages">
          <h3 className="titulo-pages">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="25"
              height="25"
              fill="currentColor"
              className="bi bi-record-fill punto-color-titulo"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M8 13A5 5 0 1 0 8 3a5 5 0 0 0 0 10"
              />
            </svg>
            Escuela de Jockeys
          </h3>
        </div>

        <div className="separador-pages"></div>

        <div className="contenedorHistoria">
          {/* SECCIÓN 1 */}
          <div className="historia">
            <figure>
              <img
                src={escuela1}
                alt="Imagen de la Escuela de Jockeys"
                loading="lazy"
              />
              <figcaption>
                Formación integral en la Escuela de Jockeys de Tucumán.
              </figcaption>
            </figure>
            <p>
              La Escuela de Jockeys del Hipódromo de Tucumán es una institución
              destacada en el ámbito hípico de la región, dedicada a la formación
              de jockeys profesionales. Fundada con el objetivo de{" "}
              <strong>profesionalizar el deporte</strong> y{" "}
              <strong>ofrecer oportunidades</strong> a jóvenes apasionados por el
              turf, la escuela se ha convertido en un referente en la formación
              de jockeys en Argentina.
            </p>
          </div>

          {/* SECCIÓN 2 */}
          <div className="historia">
            <p>
              La escuela no solo enseña las habilidades necesarias para competir
              en carreras, sino que también proporciona un{" "}
              <strong>entorno de contención y desarrollo integral</strong> para
              sus estudiantes. Este enfoque incluye educación en técnicas de
              equitación, conocimientos sobre el{" "}
              <strong>cuidado y entrenamiento de caballos</strong>, así como
              aspectos de ética y profesionalismo dentro del deporte hípico.
            </p>
            <figure>
              <img
                src={escuela2}
                alt="Entrenamiento en la Escuela de Jockeys"
                loading="lazy"
              />
              <figcaption>
                Entrenamiento de los chicos en la escuela.
              </figcaption>
            </figure>
          </div>

          {/* SECCIÓN 3 */}
          <div className="historia">
            <figure>
              <img
                src={escuela3}
                alt="Eventos de la Escuela de Jockeys"
                loading="lazy"
              />
              <figcaption>
                Estudiantes ya participando en el vareo del dia a dia.
              </figcaption>
            </figure>
            <p>
              La Escuela de Jockeys celebra su <strong>aniversario anualmente</strong>, 
              destacando los logros y el impacto positivo que ha tenido en la comunidad. 
              Además, participa activamente en eventos importantes del calendario hípico, 
              como el <strong>Gran Premio Batalla de Tucumán</strong>, uno de los eventos más 
              destacados en el país, donde muchos de sus estudiantes tienen la oportunidad 
              de demostrar sus habilidades en la pista.
            </p>
          </div>

          {/* CONTACTOS */}
          <div className="container-telefonos">
            <div className="container-titulos">
              <i className="bi bi-telephone"></i>
              <div>
                <span className="titulo-sectores">Prof. Rivera Alejandro</span>
                <br />
                <span className="descripcion-sectores">
                  <a href="tel:+1234567890">Llamar al +3815235087</a>
                </span>
              </div>
            </div>

            <div className="container-titulos">
              <i className="bi bi-telephone"></i>
              <div>
                <span className="titulo-sectores">Prof. Jorge Gine</span>
                <br />
                <span className="descripcion-sectores">
                  <a href="tel:+1234567890">Llamar al +3813326590</a>
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Escuela;
