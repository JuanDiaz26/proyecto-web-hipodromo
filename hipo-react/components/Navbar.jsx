import React from "react";
import "./Navbar.css";
import { useLocation, useNavigate } from "react-router-dom";
import { Offcanvas } from "bootstrap";

export default function Navbar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const path = pathname.toLowerCase();

  // --- Offcanvas control ---
  const OFFCANVAS_ID = "offcanvasNav";
  const closeOffcanvas = () => {
    const el = document.getElementById(OFFCANVAS_ID);
    if (el) Offcanvas.getOrCreateInstance(el).hide();
  };
  const go = (to) => {
    navigate(to);
    setTimeout(closeOffcanvas, 0);
  };

  // --- Activos ---
  const carrerasPaths = ["/programas","/resultados","/cartas","/inscripcion","/estadisticas","/escalas","/ultimascarreras"];
  const apuestasPaths = ["/agencias","/comoapostar","/tiposapuestas"];
  const institucionalPaths = ["/historia","/carrerasdestacadas","/museo","/escuela"];

  const isInicio        = path === "/";
  const isCarreras      = carrerasPaths.some(p => path.startsWith(p));
  const isApuestas      = apuestasPaths.some(p => path.startsWith(p));
  const isInstitucional = institucionalPaths.some(p => path.startsWith(p));

  const navClass = (base, active) => `${base} ${active ? "active" : ""}`;

  return (
    <div className={`contenedor-navegador ${isInicio ? "navbar-inicio" : "navbar-pages"}`}>
      <nav className={`navbar navbar-expand-md fixed-top ${isInicio ? "navbar-dark navbar-inicio-estilo" : "navbar-dark navbar-pages-estilo"}`}>
        <div className="container-fluid ">
          {/* Logo */}
          <a
            className="navbar-brand"
            href="#"
            onClick={(e) => { e.preventDefault(); go("/"); }}
            data-bs-dismiss="offcanvas"
          >
            <img
              className={`logo-hipo-inicio ${isInicio ? "d-md-none" : ""}`}
              src={isInicio ? "/logohipoblanco.png" : "/logohipocolor.png"}
              alt="Logo HipodromodeTucuman"
              loading="lazy"
            />
          </a>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target={`#${OFFCANVAS_ID}`}
            aria-controls={OFFCANVAS_ID}
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div
            className="offcanvas offcanvas-end text-bg-dark"
            tabIndex="-1"
            id={OFFCANVAS_ID}
            aria-labelledby={`${OFFCANVAS_ID}Label`}
          >
            <div className="offcanvas-header">
              <h5 className="offcanvas-title" id={`${OFFCANVAS_ID}Label`}>
                Hipódromo de Tucumán
              </h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                data-bs-dismiss="offcanvas"
                aria-label="Close"
              ></button>
            </div>

            <div className="offcanvas-body">
              <ul className="navbar-nav justify-content-center flex-grow-1 pe-3">
                {/* INICIO */}
                <li className="nav-item">
                  <a
                    href="#"
                    className={navClass("nav-link not-bold", isInicio)}
                    onClick={(e) => { e.preventDefault(); go("/"); }}
                  >
                    <i className="bi bi-house-fill"></i> Inicio
                  </a>
                </li>

                {/* CARRERAS */}
                <li className="nav-item dropdown">
                  <a
                    href="#"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    className={navClass("nav-link not-bold dropdown-toggle", isCarreras)}
                  >
                    <i className="bi bi-flag-fill"></i> Carreras
                  </a>
                  <ul className="dropdown-menu dropdown-menu-dark">
                    <li>
                      <a
                        href="#"
                        className={navClass("dropdown-item", path === "/programas")}
                        onClick={(e) => { e.preventDefault(); go("/programas"); }}
                      >
                        Programas
                      </a>
                    </li>
                    <li><hr className="dropdown-divider" /></li>

                    <li>
                      <a
                        href="#"
                        className={navClass("dropdown-item", path === "/resultados")}
                        onClick={(e) => { e.preventDefault(); go("/resultados"); }}
                      >
                        Resultados
                      </a>
                    </li>
                    <li><hr className="dropdown-divider" /></li>

                    <li>
                      <a
                        href="#"
                        className={navClass("dropdown-item", path === "/cartas")}
                        onClick={(e) => { e.preventDefault(); go("/cartas"); }}
                      >
                        Cartas de Llamadas
                      </a>
                    </li>
                    <li><hr className="dropdown-divider" /></li>

                    <li>
                      <a
                        href="#"
                        className={navClass("dropdown-item", path === "/inscripcion")}
                        onClick={(e) => { e.preventDefault(); go("/inscripcion"); }}
                      >
                        Inscripción
                      </a>
                    </li>
                    <li><hr className="dropdown-divider" /></li>

                    <li>
                      <a
                        href="#"
                        className={navClass("dropdown-item", path === "/estadisticas")}
                        onClick={(e) => { e.preventDefault(); go("/estadisticas"); }}
                      >
                        Estadísticas
                      </a>
                    </li>
                    <li><hr className="dropdown-divider" /></li>

                    <li>
                      <a
                        href="#"
                        className={navClass("dropdown-item", path === "/escalas")}
                        onClick={(e) => { e.preventDefault(); go("/escalas"); }}
                      >
                        Escala de premios
                      </a>
                    </li>
                    <li><hr className="dropdown-divider" /></li>

                    <li>
                      <a
                        href="#"
                        className={navClass("dropdown-item", path === "/ultimascarreras")}
                        onClick={(e) => { e.preventDefault(); go("/ultimascarreras"); }}
                      >
                        Últimas carreras
                      </a>
                    </li>
                  </ul>
                </li>

                {/* APUESTAS */}
                <li className="nav-item dropdown">
                  <a
                    href="#"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    className={navClass("nav-link not-bold dropdown-toggle", isApuestas)}
                  >
                    <i className="bi bi-cash-coin"></i> Apuestas
                  </a>
                  <ul className="dropdown-menu dropdown-menu-dark">
                    <li>
                      <a
                        href="#"
                        className={navClass("dropdown-item", path === "/agencias")}
                        onClick={(e) => { e.preventDefault(); go("/agencias"); }}
                      >
                        Agencias
                      </a>
                    </li>
                    <li><hr className="dropdown-divider" /></li>

                    <li>
                      <a
                        href="#"
                        className={navClass("dropdown-item", path === "/comoapostar")}
                        onClick={(e) => { e.preventDefault(); go("/comoapostar"); }}
                      >
                        Cómo apostar?
                      </a>
                    </li>
                    <li><hr className="dropdown-divider" /></li>

                    <li>
                      <a
                        href="#"
                        className={navClass("dropdown-item", path === "/tiposapuestas")}
                        onClick={(e) => { e.preventDefault(); go("/tiposapuestas"); }}
                      >
                        Tipos de apuestas
                      </a>
                    </li>
                  </ul>
                </li>

                {/* CONTACTO */}
                <li className="nav-item">
                  <a
                    href="#"
                    className={navClass("nav-link not-bold", path === "/contacto")}
                    onClick={(e) => { e.preventDefault(); go("/contacto"); }}
                  >
                    <i className="bi bi-telephone-fill"></i> Contacto
                  </a>
                </li>

                {/* INSTITUCIONAL */}
                <li className="nav-item dropdown">
                  <a
                    href="#"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    className={navClass("nav-link not-bold dropdown-toggle", isInstitucional)}
                  >
                    <i className="bi bi-building-fill"></i> Institucional
                  </a>
                  <ul className="dropdown-menu dropdown-menu-dark">
                    <li>
                      <a
                        href="#"
                        className={navClass("dropdown-item", path === "/historia")}
                        onClick={(e) => { e.preventDefault(); go("/historia"); }}
                      >
                        Historia
                      </a>
                    </li>
                    <li><hr className="dropdown-divider" /></li>

                    <li>
                      <a
                        href="#"
                        className={navClass("dropdown-item", path === "/carrerasdestacadas")}
                        onClick={(e) => { e.preventDefault(); go("/carrerasdestacadas"); }}
                      >
                        Carreras Destacadas
                      </a>
                    </li>
                    <li><hr className="dropdown-divider" /></li>

                    <li>
                      <a
                        href="#"
                        className={navClass("dropdown-item", path === "/museo")}
                        onClick={(e) => { e.preventDefault(); go("/museo"); }}
                      >
                        Museo
                      </a>
                    </li>
                    <li><hr className="dropdown-divider" /></li>

                    <li>
                      <a
                        href="#"
                        className={navClass("dropdown-item", path === "/escuela")}
                        onClick={(e) => { e.preventDefault(); go("/escuela"); }}
                      >
                        Escuela de Jockeys
                      </a>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>

        </div>
      </nav>
    </div>
  );
}
