// src/pages/Escalas.jsx
import React from "react";
import Navbar from "../../components/Navbar";
import "./TablasPages.css";

const escalas = [
  {
    categoria: "Condicional",
    premios: [
      ["1° Puesto", "$ 1.586.200,00"],
      ["2° Puesto", "$ 475.900,00"],
      ["3° Puesto", "$ 396.600,00"],
      ["4° Puesto", "$ 317.200,00"],
      ["5° Puesto", "$ 237.900,00"],
      ["6° Puesto", "$ 158.600,00"],
    ],
  },
  {
    categoria: "Potrillos",
    premios: [
      ["1° Puesto", "$ 2.856.300,00"],
      ["2° Puesto", "$ 856.800,00"],
      ["3° Puesto", "$ 714.000,00"],
      ["4° Puesto", "$ 571.200,00"],
      ["5° Puesto", "$ 428.500,00"],
      ["6° Puesto", "$ 285.600,00"],
    ],
  },
  {
    categoria: "3 años y + Edad",
    premios: [
      ["1° Puesto", "$ 2.276.100,00"],
      ["2° Puesto", "$ 682.800,00"],
      ["3° Puesto", "$ 569.000,00"],
      ["4° Puesto", "$ 455.200,00"],
      ["5° Puesto", "$ 341.400,00"],
      ["6° Puesto", "$ 227.600,00"],
    ],
  },
  {
    categoria: "Especial",
    premios: [
      ["1° Puesto", "$ 2.387.600,00"],
      ["2° Puesto", "$ 716.300,00"],
      ["3° Puesto", "$ 596.900,00"],
      ["4° Puesto", "$ 477.500,00"],
      ["5° Puesto", "$ 358.200,00"],
      ["6° Puesto", "$ 238.700,00"],
    ],
  },
  {
    categoria: "Clasico Potrillos",
    premios: [
      ["1° Puesto", "$ 3.268.000,00"],
      ["2° Puesto", "$ 980.300,00"],
      ["3° Puesto", "$ 817.000,00"],
      ["4° Puesto", "$ 653.600,00"],
      ["5° Puesto", "$ 490.200,00"],
      ["6° Puesto", "$ 326.800,00"],
    ],
  },
  {
    categoria: "Clasico Adultos",
    premios: [
      ["1° Puesto", "$ 2.864.500,00"],
      ["2° Puesto", "$ 859.300,00"],
      ["3° Puesto", "$ 716.200,00"],
      ["4° Puesto", "$ 573.000,00"],
      ["5° Puesto", "$ 429.700,00"],
      ["6° Puesto", "$ 286.400,00"],
    ],
  },
  {
    categoria: "Extraoficial",
    premios: [
      ["1° Puesto", "$ 1.080.100,00"],
      ["2° Puesto", "$ 324.100,00"],
      ["3° Puesto", "$ 270.100,00"],
      ["4° Puesto", "$ 216.000,00"],
      ["5° Puesto", "$ 162.000,00"],
      ["6° Puesto", "$ 108.000,00"],
    ],
  },
  {
    categoria: "Extraoficial 3 años",
    premios: [
      ["1° Puesto", "$ 2.377.900,00"],
      ["2° Puesto", "$ 713.500,00"],
      ["3° Puesto", "$ 594.400,00"],
      ["4° Puesto", "$ 475.500,00"],
      ["5° Puesto", "$ 356.700,00"],
      ["6° Puesto", "$ 237.800,00"],
    ],
  },
];

const Escalas = () => {
  return (
    <>
      <header className="header-pages">
        <div className="navbar-wrapper">
            <Navbar />
        </div>
      </header>

      <main className="main-inicio main-pages">
        <a
          className="whatsapp-icon .whatsapp-icon-page1"
          href="https://wa.me/+5493812067808?text=Hola%20buenas,%20una%20consulta."
          target="_blank"
          rel="noreferrer"
        >
          <i className="bi bi-whatsapp wp-icon"></i>
        </a>

        <div className="container-titulo-pages">
          <h3 className="titulo-pages titulo-programas">
            {/* Icono de Dinero/Premios */}
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-currency-dollar punto-color-titulo" viewBox="0 0 16 16">
              <path d="M4 10.781c.148 1.667 1.513 2.85 3.591 3.003V15h1.043v-1.216c2.27-.179 3.678-1.438 3.678-3.3 0-1.59-.947-2.51-2.956-3.028l-.722-.187V3.467c1.122.11 1.879.714 2.07 1.616h1.47c-.166-1.6-1.54-2.748-3.54-2.875V1H7.591v1.233c-1.939.23-3.27 1.472-3.27 3.156 0 1.454.966 2.483 2.661 2.917l.61.162v4.031c-1.149-.17-1.94-.8-2.131-1.718H4zm3.391-3.836c-1.043-.263-1.6-.825-1.6-1.616 0-.944.704-1.641 1.8-1.828v3.495l-.2-.05zm1.591 1.872c1.287.323 1.852.859 1.852 1.769 0 1.097-.826 1.828-2.2 1.939V8.73l.348.086z"/>
            </svg>
            ESCALA DE PREMIOS
          </h3>
        </div>

        <div className="separador-pages"></div>

        <div className="container-escalas">
          {escalas.map((escala, index) => (
            <div className="container-tabla-escalas" key={index}>
              <div className="titulo-categoria">
                <strong>{escala.categoria}</strong>
              </div>
              <table className="tabla-escala">
                <thead>
                  <tr>
                    <th className="titulos-tabla">Puesto</th>
                    <th className="titulos-tabla">Premio</th>
                  </tr>
                </thead>
                <tbody>
                  {escala.premios.map(([puesto, premio], i) => (
                    <tr className="filas-estadisticas" key={i}>
                      <td className="tabla-text-negro">{puesto}</td>
                      <td className="tabla-text-negro">{premio}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      </main>
    </>
  );
};

export default Escalas;