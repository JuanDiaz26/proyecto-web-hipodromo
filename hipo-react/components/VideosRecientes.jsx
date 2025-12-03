import React from 'react';
import { Link } from 'react-router-dom';
import './VideosRecientes.css';

const VideosRecientes = () => {
  return (
    <section className="seccion-videos">
      <h2 className="titulo-seccion">
        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor"
          className="bi bi-record-fill punto-color-titulo" viewBox="0 0 16 16">
          <path fillRule="evenodd" d="M8 13A5 5 0 1 0 8 3a5 5 0 0 0 0 10" />
        </svg>
        Últimas carreras
      </h2>

      <div className="container-fluid mt-4 container-fluid-videos">
        <div className="row">

          {/* Tarjeta 1 */}
          <div className="col-12 col-md-6 col-lg-4 mb-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">9º Carrera <br /> Premio "Dia Del Inmigrante"</h5>
                <p className="card-text">
                  <i className="bi bi-award-fill medalla-oro"></i> Smiling Nich
                </p>
              </div>
              <div className="ratio ratio-16x9">
                <iframe
                  width="873"
                  height="492"
                  src="https://www.youtube.com/embed/b4rIQN0J9RI"
                  title="9º Carrera"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                  loading="lazy"
                ></iframe>
              </div>
            </div>
          </div>

          {/* Tarjeta 2 */}
          <div className="col-12 col-md-6 col-lg-4 mb-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">10º Carrera <br />Especial "Oscar N. Bravo"</h5>
                <p className="card-text">
                  <i className="bi bi-award-fill medalla-oro"></i> Twitch Hurricane
                </p>
              </div>
              <div className="ratio ratio-16x9">
                <iframe
                  width="873"
                  height="492"
                  src="https://www.youtube.com/embed/-57rr4UPQys"
                  title="10º Carrera"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                  loading="lazy"
                ></iframe>
              </div>
            </div>
          </div>

          {/* Tarjeta 3 */}
          <div className="col-12 col-md-6 col-lg-4 mb-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">11º Carrera <br /> Premio "Dia Del Maestro"</h5>
                <p className="card-text">
                  <i className="bi bi-award-fill medalla-oro"></i> Lord Of Moyvore
                </p>
              </div>
              <div className="ratio ratio-16x9">
                <iframe
                  width="873"
                  height="492"
                  src="https://www.youtube.com/embed/uDMN0JSfsEY"
                  title="11º Carrera"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                  loading="lazy"
                ></iframe>
              </div>
            </div>
          </div>

        </div>

        <div className="contenedor-boton-video">
          <Link to="/UltimasCarreras" className="boton-videos">Ver más</Link>
        </div>
      </div>
    </section>
  );
};

export default VideosRecientes;
