import React from "react";
import Navbar from "../../components/Navbar";
import "./TablasPages.css";

// Importación de imágenes (3 en total)
import museoGeneral from "../assets/museo-cartel.webp";
import museoLoroLopez from "../assets/loro-lopez.webp";
import bibliotecaLitoBestani from "../assets/museo-dentro.webp";

const Museo = () => {
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
          title="Hace tu consulta mediante nuestro chat de whatsapp"
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
            Museo de Turf
          </h3>
        </div>
        <div className="separador-pages"></div>

        <div className="contenedorHistoria">
          {/* SECCIÓN 1 */}
          <div className="premioBatalla">
            <div className="historia">
              <figure>
                <img
                  src={museoGeneral}
                  alt="Museo del Turf"
                  loading="lazy"
                />
                <figcaption>
                  El Museo del Turf es una parte integral del Hipódromo de Tucumán.
                </figcaption>
              </figure>
              <p>
                El museo se llama{" "}
                <strong>"Museo de Turf Luis Loro López"</strong>. Está abierto
                de lunes a viernes de 10 a 12 hs. Además, en los días de reunión
                hípica, el museo también abre de 16 a 18 hs. El museo cuenta con
                una galería fotográfica y objetos que reflejan los principales
                acontecimientos hípicos realizados desde la fundación del
                hipódromo el 2 de agosto de 1942. El museo fue fundado el 6 de
                abril de 2003 bajo la administración de la{" "}
                <strong>Caja Popular de Ahorros.</strong>
              </p>
            </div>
          </div>

          {/* SECCIÓN 2 */}
          <div className="premioBatalla">
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
                El origen de su nombre
              </h3>
            </div>
            <div className="separador-pages"></div>
            <div className="historia">
              <p>
                Se llama así en honor a <strong>Luis Gerónimo López</strong>,
                conocido popularmente como <strong>"Loro" López</strong>, un
                destacado personaje del deporte ecuestre en Tucumán. Fue un
                jockey de carrera muy querido y respetado, actuó durante 26
                años y ganó 19 veces la estadística anual. Su legado en el
                hipismo tucumano es significativo, y su contribución fue tan
                reconocida que el museo lleva su nombre.
              </p>
              <figure>
                <img
                  src={museoLoroLopez}
                  alt="Museo Luis Loro López"
                  loading="lazy"
                />
                <figcaption>
                  Homenaje a Luis "Loro" López, leyenda del turf tucumano.
                </figcaption>
              </figure>
            </div>
          </div>

          {/* SECCIÓN 3 */}
          <div className="premioBatalla">
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
                Biblioteca del turf "Lito Bestani"
              </h3>
            </div>
            <div className="separador-pages"></div>
            <div className="historia">
              <figure>
                <img
                  src={bibliotecaLitoBestani}
                  alt="Biblioteca Lito Bestani"
                  loading="lazy"
                />
                <figcaption>
                  Biblioteca con material histórico del turf latinoamericano.
                </figcaption>
              </figure>
              <p>
                Fundada en <strong>septiembre de 2005</strong>, se encuentra
                habilitada de Lunes a Viernes de{" "}
                <strong>8:00hs a 13:00hs</strong>. En ella se conservan libros
                estadísticos, revistas, catálogos, folletos y material
                turfístico de varios <strong>hipódromos de Latinoamérica</strong>.
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Museo;
