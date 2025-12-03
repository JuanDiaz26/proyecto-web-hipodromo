import React from "react";
import { useNavigate } from "react-router-dom";
import "./EstadisticasInicio.css";

export default function EstadisticasInicio() {
  const navigate = useNavigate();
  const ir = (to) => {
    navigate(to);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className="main-estadisticas">
      {/* Título con el mismo estilo que Noticias.jsx */}
      <div className="titulo-seccion">
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
        Estadisticas
      </div>
      <p className="intro-estadisticas">
        Conoce a los protagonistas que están marcando la diferencia en el turf tucumano
      </p>

      {/* Grilla de tarjetas */}
      <div className="contenedor-estadisticas">
        {/* JOCKEYS */}
        <article className="card card-top card-top--jockeys">
          <div className="card-body p-3 p-md-4">
            <div className="encabezado-card">
              <h5 className="m-0 text-white fw-bold">Top 3 Jockeys</h5>
              <span className="badge rounded-pill bg-white text-dark px-3 py-2">
                <span className="me-2 fw-semibold">TOP 3</span>
                <i className="bi bi-trophy-fill"></i>
              </span>
            </div>
            <p className="small text-white-50 mb-3">
              Jockeys con mayor porcentaje de victorias en la temporada
            </p>

            <ol className="lista-top m-0">
              <li>
                <div className="left">
                  <span className="rank-badge">1</span>
                  <div>
                    <div className="fw-semibold">Vizcarra Jose A.</div>
                    <div className="text-muted small">24 oficiales - 11 extraoficiales</div>
                  </div>
                </div>
                {/* <div className="right">
                  <div className="fw-bold text-danger-emphasis">65%</div>
                  <div className="small text-muted">efectividad</div>
                </div> */}
              </li>

              <li>
                <div className="left">
                  <span className="rank-badge">2</span>
                  <div>
                    <div className="fw-semibold">Suarez Hector A.</div>
                    <div className="text-muted small">16 oficiales - 4 extraoficiales</div>
                  </div>
                </div>
                {/* <div className="right">
                  <div className="fw-bold text-danger-emphasis">58%</div>
                  <div className="small text-muted">efectividad</div>
                </div> */}
              </li>

              <li>
                <div className="left">
                  <span className="rank-badge">3</span>
                  <div>
                    <div className="fw-semibold">Brito Francisco M.</div>
                    <div className="text-muted small">10 oficiales - 1 extraoficial</div>
                  </div>
                </div>
                {/* <div className="right">
                  <div className="fw-bold text-danger-emphasis">55%</div>
                  <div className="small text-muted">efectividad</div>
                </div> */}
              </li>
            </ol>

            <button
              className="btn btn-light w-100 d-flex align-items-center justify-content-center gap-2 mt-3"
              onClick={() => ir("/estadisticas")}
            >
              Ver Estadísticas Completas <i className="bi bi-arrow-right-short"></i>
            </button>
          </div>
        </article>

        {/* ENTRENADORES */}
        <article className="card card-top card-top--entrenadores">
          <div className="card-body p-3 p-md-4">
            <div className="encabezado-card">
              <h5 className="m-0 text-white fw-bold">Top 3 Cuidadores</h5>
              <span className="badge rounded-pill bg-white text-dark px-3 py-2">
                <span className="me-2 fw-semibold">TOP 3</span>
                <i className="bi bi-award-fill"></i>
              </span>
            </div>
            <p className="small text-white-50 mb-3">
              Entrenadores con mejor rendimiento y más victorias
            </p>

            <ol className="lista-top m-0">
              <li>
                <div className="left">
                  <span className="rank-badge">1</span>
                  <div>
                    <div className="fw-semibold">Assad Cesar A.</div>
                    <div className="text-muted small">14 oficiales - 0 extraoficiales</div>
                  </div>
                </div>
                {/* <div className="right">
                  <div className="fw-bold text-danger-emphasis">72%</div>
                  <div className="small text-muted">efectividad</div>
                </div> */}
              </li>

              <li>
                <div className="left">
                  <span className="rank-badge">2</span>
                  <div>
                    <div className="fw-semibold">Saez Juan E.</div>
                    <div className="text-muted small">10 oficiales - 1 extraoficial</div>
                  </div>
                </div>
                {/* <div className="right">
                  <div className="fw-bold text-danger-emphasis">68%</div>
                  <div className="small text-muted">efectividad</div>
                </div> */}
              </li>

              <li>
                <div className="left">
                  <span className="rank-badge">3</span>
                  <div>
                    <div className="fw-semibold">Brito Luis O.</div>
                    <div className="text-muted small">5 oficiales - 3 extraoficiales</div>
                  </div>
                </div>
                {/* <div className="right">
                  <div className="fw-bold text-danger-emphasis">64%</div>
                  <div className="small text-muted">efectividad</div>
                </div> */}
              </li>
            </ol>

            <button
              className="btn btn-light w-100 d-flex align-items-center justify-content-center gap-2 mt-3"
              onClick={() => ir("/estadisticas")}
            >
              Ver Estadísticas Completas <i className="bi bi-arrow-right-short"></i>
            </button>
          </div>
        </article>

        {/* STUDS */}
        <article className="card card-top card-top--studs">
          <div className="card-body p-3 p-md-4">
            <div className="encabezado-card">
              <h5 className="m-0 text-white fw-bold">Top 3 Caballerizas</h5>
              <span className="badge rounded-pill bg-white text-dark px-3 py-2">
                <span className="me-2 fw-semibold">TOP 3</span>
                <i className="bi bi-shield-fill-check"></i>
              </span>
            </div>
            <p className="small text-white-50 mb-3">
              Caballerizas con ejemplares más exitosos
            </p>

            <ol className="lista-top m-0">
              <li>
                <div className="left">
                  <span className="rank-badge">1</span>
                  <div>
                    <div className="fw-semibold">Abuela Tete</div>
                    <div className="text-muted small">9 oficiales - 1 extraoficial</div>
                  </div>
                </div>
                {/* <div className="right">
                  <div className="fw-bold text-danger-emphasis">78%</div>
                  <div className="small text-muted">efectividad</div>
                </div> */}
              </li>

              <li>
                <div className="left">
                  <span className="rank-badge">2</span>
                  <div>
                    <div className="fw-semibold">Monterrico</div>
                    <div className="text-muted small">5 oficiales - 0 extraoficiales</div>
                  </div>
                </div>
                {/* <div className="right">
                  <div className="fw-bold text-danger-emphasis">74%</div>
                  <div className="small text-muted">efectividad</div>
                </div> */}
              </li>

              <li>
                <div className="left">
                  <span className="rank-badge">3</span>
                  <div>
                    <div className="fw-semibold">Seba y Cami</div>
                    <div className="text-muted small">4 oficiales - 2 extraoficiales</div>
                  </div>
                </div>
                {/* <div className="right">
                  <div className="fw-bold text-danger-emphasis">70%</div>
                  <div className="small text-muted">efectividad</div>
                </div> */}
              </li>
            </ol>

            <button
              className="btn btn-light w-100 d-flex align-items-center justify-content-center gap-2 mt-3"
              onClick={() => ir("/estadisticas")}
            >
              Ver Estadísticas Completas <i className="bi bi-arrow-right-short"></i>
            </button>
          </div>
        </article>
      </div>
    </section>
  );
}
