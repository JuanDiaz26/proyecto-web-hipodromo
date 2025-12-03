// src/pages/Programas.jsx
import React from "react";
import Navbar from "../../components/Navbar";
import "./TablasPages.css";

const programas = [
  { nombre: "Reunión nº 16 - 24 de Septiembre", link: "https://drive.google.com/file/d/1XUej832-cpyD6P2OFq_PApzg0cYWl5zj/view?usp=sharing" },
  { nombre: "Reunión nº 15 - 7 de Septiembre", link: "https://drive.google.com/file/d/17c6YbUNb_4GFRut3C3C1KZWAaZzPSy2o/view?usp=sharing" },
  { nombre: "Reunión nº 14 - 24 de Agosto", link: "https://drive.google.com/file/d/1M9VZqdpMSJyi1rarpP6yQSlpcynDbK-0/view?usp=sharing" },
  { nombre: "Reunión nº 13 - 10 de Agosto", link: "https://drive.google.com/file/d/1RrqY6CLtKwXqOo85riXoHBPAHq1lB40I/view?usp=sharing" },
  { nombre: "Reunión nº 12 - 27 de Julio", link: "https://drive.google.com/file/d/1wwdDhchSxykwxWEnXCNOKLs-INdbdbYR/view?usp=sharing" },
  { nombre: "Reunión nº 11 - 13 de Julio", link: "https://drive.google.com/file/d/1C1-F7CLhzkuHCRVjfNHAmo7S3pOBpiSV/view?usp=sharing" },
  { nombre: "Reunión nº 9 - 22 de Junio",  link: "https://drive.google.com/file/d/1slfXnFDBYQluSze6IHmo9qJmLVLWeYU2/view?usp=sharing" },
  { nombre: "Reunión nº 10 - 8 de Junio", link: "https://drive.google.com/file/d/1P7DSUluYFeX7qBUATNrWpnLrv1wLGkeX/view?usp=sharing" },
  { nombre: "Reunión nº 8 - 25 de Mayo",  link: "https://drive.google.com/file/d/1jBZSkJFBFMzQfMxun-l5reGU4R_cegaf/view?usp=sharing" },
  { nombre: "Reunión nº 7 - 11 de Mayo",  link: "https://drive.google.com/file/d/1o5hsY1VizfgGSmMtmZosFMWLGo9mJviL/view?usp=sharing" },
  { nombre: "Reunión nº 6 - 26 de Abril",  link: "https://drive.google.com/file/d/1u0777Ewb4Rt9mvEegEg_d3GnSChFbjdO/view?usp=sharing" },
  { nombre: "Reunión nº 5 - 13 de Abril",  link: "https://drive.google.com/file/d/1WwJ9VpwvIP-rYDI2esUUN1p4i1dAWahn/view?usp=sharing" },
  { nombre: "Reunión nº 4 - 30 de Marzo",  link: "https://drive.google.com/file/d/1jWBNfoPYLteyhOHT6zXjdH5lg2c2XKgn/view?usp=sharing" },
  { nombre: "Reunión nº 3 - 16 de Marzo",  link: "https://drive.google.com/file/d/1PpecK-ePocV9jJBF4aKfrGEIonLJlZZD/view?usp=sharing" },
  { nombre: "Reunión nº 2 - 23 de Febrero", link: "https://drive.google.com/file/d/1RnNe2rl6UQU5E5CmVDTlfVSSNCJCNNk_/view?usp=sharing" },
  { nombre: "Reunión nº 1 - 16 de Febrero", link: "https://drive.google.com/file/d/1nmai42BIDXeC-raDAljnH8VOxkEJVBZ8/view?usp=sharing" },
];

const Programas = () => {
  return (
    <>
      <header className="header-pages">
        {/* Envolvemos el Navbar para asegurar el centrado si es necesario */}
        <div className="navbar-wrapper">
            <Navbar />
        </div>
      </header>

      <main className="main-inicio main-pages">
        <div className="container-titulo-pages">
          <h3 className="titulo-pages titulo-programas"> 
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              fill="currentColor"
              className="bi bi-calendar-check-fill punto-color-titulo"
              viewBox="0 0 16 16"
            >
              <path d="M4 .5a.5.5 0 0 0-1 0V1H2a2 2 0 0 0-2 2v1h16V3a2 2 0 0 0-2-2h-1V.5a.5.5 0 0 0-1 0V1H4V.5zM16 14V5H0v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2zm-5.146-5.146l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 0 1 .708-.708L7.5 10.793l2.646-2.647a.5.5 0 0 1 .708.708z"/>
            </svg>
            PROGRAMAS DE CARRERAS
          </h3>
        </div>
        
        <div className="separador-pages"></div>

        <div className="container-programas">
          <table>
            <thead>
              <tr>
                <th className="th-nombre-reunion">REUNIÓN Y FECHA</th>
                <th className="th-descarga">DESCARGAR</th>
              </tr>
            </thead>
            <tbody>
              {programas.map((programa, index) => (
                <tr key={index} className="programa-row">
                  <td className="celda-nombre">
                    {programa.nombre.toUpperCase()}
                  </td>
                  <td className="celda-descarga">
                    <a href={programa.link} target="_blank" rel="noopener noreferrer" className="btn-descargar">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor" /* Importante */
                        className="bi bi-download"
                        viewBox="0 0 16 16"
                      >
                        <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
                        <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/>
                      </svg>
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </>
  );
};

export default Programas;