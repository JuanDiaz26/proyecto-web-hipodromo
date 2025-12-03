import React from "react";
import Navbar from "../../components/Navbar";
import "./TablasPages.css";

const Inscripcion = () => {
  const inscripciones = [
    { nombre: "Reunión nº 16 - 24 de Septiembre", link: "https://drive.google.com/file/d/1L66XoVMZNm-LtU9_InkvwR63lfLBzLWd/view?usp=sharing" },
    { nombre: "Reunión nº 15 - 7 de Septiembre", link: "https://drive.google.com/file/d/1g_Oz7bwhHD2wDjD2cXE_90ugLsGnYii3/view?usp=sharing" },
    { nombre: "Reunión nº 14 - 24 de Agosto", link: "https://drive.google.com/file/d/1LxDxTRWLQyAJaef7VMMa4zR1KP-uR4FH/view?usp=sharing" },
    { nombre: "Reunión nº 13 - 10 de Agosto", link: "https://drive.google.com/file/d/12HO8GMd2XrenJrUm9l6AV2Qy6oKiff3-/view?usp=sharing" },
    { nombre: "Reunión nº 12 - 27 de Julio", link: "https://drive.google.com/file/d/1KJhii_G5L0ZnXo3iZFaabDYSFSPie7Zn/view?usp=sharing" },
    { nombre: "Reunión nº 11 - 13 de Julio", link: "https://drive.google.com/file/d/1sz9x1RiDc4i0xgNWWjPUGT1wVAt2cna0/view?usp=sharing" },
    { nombre: "Reunión nº 9 - 22 de Junio",  link: "https://drive.google.com/file/d/1OYjiHlmF8BtT0Gl_ZsjY80TPxI0x_DbX/view?usp=sharing" },
    { nombre: "Reunión nº 10 - 8 de Junio", link: "https://drive.google.com/file/d/1vuc4o0UsRZfKCYdJa1pdpg7eddUh4QMR/view?usp=sharing" },
    { nombre: "Reunión nº 8 - 25 de Mayo",  link: "https://drive.google.com/file/d/1TgxPIfcz7ih8GpWtKW1OM8mkHaQo6QuT/view?usp=sharing" },
    { nombre: "Reunión nº 7 - 11 de Mayo",  link: "https://drive.google.com/file/d/1_iQ5vdYheNFMNX2btDrlih5cCwodH1EP/view?usp=sharing" },
    { nombre: "Reunión nº 6 - 26 de Abril",  link: "https://drive.google.com/file/d/1RxC0RpPGPitQbXCrEAv2P10RZiccWaYJ/view?usp=sharing" },
    { nombre: "Reunión nº 5 - 13 de Abril",  link: "https://drive.google.com/file/d/1gvxSkjJGJHaz6fjRKt4405x84zOZwRXW/view?usp=sharing" },
    { nombre: "Reunión nº 4 - 30 de Marzo",  link: "https://drive.google.com/file/d/15xH-UKNnYcRRs_S3GDTnDaqNPNSCx3ch/view?usp=sharing" },
    { nombre: "Reunión nº 3 - 16 de Marzo",  link: "https://drive.google.com/file/d/1XBtvHWvLai35hcHJZ6S1DpFdTg3gvKzI/view?usp=sharing" },
    { nombre: "Reunión nº 2 - 23 de Febrero", link: "https://drive.google.com/file/d/1o6CbvQn-bIpMVwG3LNVxcTQsYfqLifIf/view?usp=sharing" },
    { nombre: "Reunión nº 1 - 16 de Febrero", link: "https://drive.google.com/file/d/1-lTss8ZrOkJOVs7lyBTm4sdnBXCznYo7/view?usp=sharing" },
  ];

  return (
    <>
      <header className="header-pages">
        <div className="navbar-wrapper">
            <Navbar />
        </div>
      </header>

      <main className="main-inicio main-pages">
        <div className="container-titulo-pages">
          {/* Usamos la clase titulo-programas para el estilo consistente */}
          <h3 className="titulo-pages titulo-programas">
            {/* Icono de Lápiz/Edición para Inscripciones */}
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-pencil-square punto-color-titulo" viewBox="0 0 16 16">
              <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
              <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
            </svg>
            INSCRIPCIONES
          </h3>
        </div>

        <div className="separador-pages"></div>

        <div className="container-programas">
          <table>
            <thead>
              <tr>
                <th className="th-nombre-reunion">INSCRIPTOS A LA REUNIÓN</th>
                <th className="th-descarga">DESCARGAR</th>
              </tr>
            </thead>
            <tbody>
              {inscripciones.map((item, index) => (
                <tr key={index} className="programa-row">
                  <td className="celda-nombre">{item.nombre.toUpperCase()}</td>
                  <td className="celda-descarga">
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-descargar"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-download" viewBox="0 0 16 16">
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

export default Inscripcion;