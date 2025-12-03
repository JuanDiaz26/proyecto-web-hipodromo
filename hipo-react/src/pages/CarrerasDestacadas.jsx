import React from "react";
import Navbar from "../../components/Navbar";
import "./TablasPages.css";

// Importación de imágenes (6 en total)
import hipoGranPremio from "../assets/batalla-trofeos.webp";
import cajaPopular from "../assets/caja-carrera.webp";
import carreraEstrellas from "../assets/estrellas-1.webp";
import estrellasTucumanas from "../assets/estrella-tucu.webp";
import clasicoPellegrini from "../assets/pellegrini-2024.webp";
import clasicoAniversario from "../assets/aniv-hipo.webp";

const CarrerasDestacadas = () => {
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
            Carreras Destacadas
          </h3>
        </div>

        <div className="separador-pages"></div>

        <div className="contenedorHistoria">
          {/* Gran Premio Batalla de Tucumán */}
          <div className="premioBatalla">
            <strong className="titulos-descargar-call center">
              Gran Premio "Batalla de Tucumán"
            </strong>
            <div className="historia">
              <figure>
                <img
                  src={hipoGranPremio}
                  alt="imagen del Gran Premio Batalla de Tucumán"
                  loading="lazy"
                />
                <figcaption>
                  La disputa del Gran Premio Batalla de Tucumán atrae a más de
                  20,000 espectadores todos los 24 de septiembre.
                </figcaption>
              </figure>
              <p>
                Esta <strong>carrera interprovincial</strong> ha ganado{" "}
                <strong>enorme prestigio</strong> al reunir en sus pistas a los{" "}
                <strong>mejores caballos de pura sangre</strong> que actúan en
                el interior del país y calificados fondistas de perfil clásico,
                que corren en los <strong>máximos hipódromos del país</strong>,
                como <strong>Palermo</strong>, <strong>San Isidro</strong> y{" "}
                <strong>La Plata</strong>.
              </p>
            </div>
          </div>

          {/* Clásico Caja Popular de Ahorros */}
          <div className="premioBatalla">
            <strong className="titulos-descargar-call center">
              Clásico "Caja Popular de Ahorros de Tucumán"
            </strong>
            <div className="historia">
              <p>
                Este clásico se celebra en honor al{" "}
                <strong>
                  aniversario de la Caja Popular de Ahorros de la Provincia de
                  Tucumán
                </strong>
                . Este evento se ha convertido en una{" "}
                <strong>tradición significativa</strong> dentro del calendario
                hípico regional.
              </p>
              <figure>
                <img
                  src={cajaPopular}
                  alt="imagen caja popular de ahorros"
                  loading="lazy"
                />
                <figcaption>
                  Clasico 110º Aniv. Caja Popular de Ahorros de Tucumán.
                </figcaption>
              </figure>
            </div>
          </div>

          {/* Carrera de las Estrellas */}
          <div className="premioBatalla">
            <strong className="titulos-descargar-call center">
              Clasico "Carrera de las Estrellas"
            </strong>
            <div className="historia">
              <figure>
                <img
                  src={carreraEstrellas}
                  alt="imagen carrera de las estrellas"
                  loading="lazy"
                />
                <figcaption>
                  Carrera para potrillos inscriptos en la Fundación Equina Argentina.
                </figcaption>
              </figure>
              <p>
                Las <strong>Carreras de las Estrellas</strong>, iniciadas en
                Argentina en 1991 e inspiradas por la{" "}
                <strong>Breeders' Cup</strong> de Estados Unidos, son uno de los
                eventos hípicos más importantes del país.
              </p>
            </div>
          </div>

          {/* Estrellas Tucumanas */}
          <div className="premioBatalla">
            <strong className="titulos-descargar-call center">
              Clasico "Estrellas Tucumanas"
            </strong>
            <div className="historia">
              <p>
                Las Carreras de las Estrellas Tucumanas son un evento hípico
                inspirado en las tradicionales{" "}
                <strong>Carreras de las Estrellas</strong> que se celebran en{" "}
                <strong>Buenos Aires</strong> para spc 4 años y más edad inscriptos.
              </p>
              <figure>
                <img
                  src={estrellasTucumanas}
                  alt="imagen estrellas tucumanas"
                  loading="lazy"
                />
                <figcaption>
                  Las Estrellas Tucumanas reúnen a los mejores caballos del norte.
                </figcaption>
              </figure>
            </div>
          </div>

          {/* Clásico Aniversario del Hipódromo de Tucumán */}
          <div className="premioBatalla">
            <strong className="titulos-descargar-call center">
              Clásico "Aniv. Hipódromo de Tucumán"
            </strong>
            <div className="historia">
              <figure>
                <img
                  src={clasicoAniversario}
                  alt="imagen clásico aniversario hipódromo de Tucumán"
                  loading="lazy"
                />
                <figcaption>
                  Facundo Moran en la entrega del 110º Aniv. Hipodrómo de Tucumán.
                </figcaption>
              </figure>
              <p>
                El <strong>Clásico Aniversario del Hipódromo de Tucumán</strong>{" "}
                celebra la fundación del circo hípico (2 de agosto de 1942). Es
                un evento emblemático que reúne a la comunidad turfística y
                destaca la importancia histórica y cultural del hipódromo en la
                región.
              </p>
            </div>
          </div>

          {/* Clásico Carlos Pellegrini */}
          <div className="premioBatalla">
            <strong className="titulos-descargar-call center">
              Clásico "Carlos Pellegrini"
            </strong>
            <div className="historia">
              <p>
                El <strong>Clásico Carlos Pellegrini</strong>, celebrado
                anualmente en el <strong>Hipódromo de San Isidro</strong>, es una
                de las competencias más prestigiosas del turf argentino.
              </p>
              <figure>
                <img
                  src={clasicoPellegrini}
                  alt="imagen clásico carlos pellegrini"
                  loading="lazy"
                />
                <figcaption>
                  He's a Rockstar se llevó el Clasico Pellegrini en la ultima reunión.
                </figcaption>
              </figure>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default CarrerasDestacadas;
