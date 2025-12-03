import React from 'react';
import Navbar from '../../components/Navbar';
import './TablasPages.css'; 

const resultados = [
  {
    nombre: "Resultados nº 15 - 7 de Septiembre",
    link: "https://drive.google.com/file/d/1AumQD64c2eHCwvn_J3i1jBYLk7ULucTs/view?usp=sharing",
  },
  {
    nombre: "Resultados nº 14 - 24 de Agosto",
    link: "https://drive.google.com/file/d/1ci_xKblTg7sm1xZiQ1CJSXc4DkCdc4Yu/view?usp=sharing",
  },
  {
    nombre: "Resultados nº 13 - 10 de Agosto",
    link: "https://drive.google.com/file/d/1SU_hKJt_u5NBOPGYGx2FK78gcyuI633A/view?usp=sharing",
  },
  {
    nombre: "Resultados nº 12 - 27 de Julio",
    link: "https://drive.google.com/file/d/1e03-agk3AwNXKCF4cL_Wpme9Z5kVKak2/view?usp=sharing",
  },
  {
    nombre: "Resultados nº 11 - 13 de Julio",
    link: "https://drive.google.com/file/d/1G4T-wsD4jwbHPiqdDKqQGjX9WQcYQCjk/view?usp=sharing",
  },
  {
    nombre: "Resultados nº 10 - 22 de Junio",
    link: "https://drive.google.com/file/d/1w-WnAUoBQS0yGqe9urnv2EZv-5wIygNe/view?usp=sharing",
  },
  {
    nombre: "Resultados nº 9 - 8 de Junio",
    link: "https://drive.google.com/file/d/1RKb7v3LurZ6yGVmIpG1IKpv-mJT4cD5M/view?usp=sharing",
  },
  {
    nombre: "Resultados nº 8 - 25 de Mayo",
    link: "https://drive.google.com/file/d/1Bpq7ROtbMkdU4GmCv4RyObyz-O-D0DRz/view?usp=sharing",
  },
  {
    nombre: "Resultados nº 7 - 11 de Mayo",
    link: "https://drive.google.com/file/d/1JrobO1VpOGyGt5ZXExa3CoofGaClCGkC/view?usp=sharing",
  },
  {
    nombre: "Resultados nº 6 - 26 de Abril",
    link: "https://drive.google.com/file/d/1tZERDZEWWxoLuNa-efPJBiIVm9jAJ4gT/view?usp=sharing",
  },
  {
    nombre: "Resultados nº 5 - 13 de Abril",
    link: "https://drive.google.com/file/d/1JuutLaLY9ZvlBq3iDARAUqx-PislO8Su/view?usp=sharing",
  },
  {
    nombre: "Resultados nº 4 - 30 de Marzo",
    link: "https://drive.google.com/file/d/1JSYaTslo1zW_aOYzhKse7bw2AMOv2saQ/view?usp=sharing",
  },
  {
    nombre: "Resultados nº 3 - 16 de Marzo",
    link: "https://drive.google.com/file/d/1IsvZBH4KPjechMBypfvsVOH4GMZVvNEX/view?usp=sharing",
  },
  {
    nombre: "Resultados nº 2 - 23 de Febrero",
    link: "https://drive.google.com/file/d/1BpV9tgmYhfIiwO6UP020EfNJ4NwP81A4/view?usp=sharing",
  },
  {
    nombre: "Resultados nº 1 - 16 de Febrero",
    link: "https://drive.google.com/file/d/1r7wfjByHpbCLs0gkNAp3s-tnURG4O5px/view?usp=sharing",
  },
];

const Resultados = () => {
  return (
    <>
      <header className="header-pages">
        <div className="navbar-wrapper">
            <Navbar />
        </div>
      </header>

      <main className="main-inicio main-pages">
        <div className="container-titulo-pages">
          {/* Usamos la clase titulo-programas para mantener el subrayado verde azulado */}
          <h3 className="titulo-pages titulo-programas">
            {/* Icono de Trofeo para Resultados */}
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor"
              className="bi bi-trophy-fill punto-color-titulo" viewBox="0 0 16 16">
              <path d="M2.5.5A.5.5 0 0 1 3 0h10a.5.5 0 0 1 .5.5c0 .538-.012 1.05-.034 1.536a3 3 0 1 1-1.133 5.89c-.79 1.865-1.878 2.777-2.833 3.011v2.173l1.425.356c.194.048.377.135.537.255L13.3 15.1a.5.5 0 0 1-.3.9H3a.5.5 0 0 1-.3-.9l1.838-1.379c.16-.12.343-.207.537-.255L6.5 13.11v-2.173c-.955-.234-2.043-1.146-2.833-3.012a3 3 0 1 1-1.132-5.89A33.076 33.076 0 0 1 2.5.5zm.099 2.54a2 2 0 0 0 .72 3.935c-.333-1.05-.588-2.346-.72-3.935zm10.083 3.935a2 2 0 0 0 .72-3.935c-.133 1.589-.388 2.885-.72 3.935z"/>
            </svg>
            RESULTADOS OFICIALES
          </h3>
        </div>

        <div className="separador-pages"></div>

        {/* Reutilizamos el contenedor 'programas' para que la tabla sea idéntica */}
        <div className="container-programas">
          <table>
            <thead>
              <tr>
                <th className="th-nombre-reunion">REUNIÓN Y FECHA</th>
                <th className="th-descarga">DESCARGAR</th>
              </tr>
            </thead>
            <tbody>
              {resultados.map((resultado, index) => (
                <tr key={index} className="programa-row">
                  <td className="celda-nombre">{resultado.nombre.toUpperCase()}</td>
                  <td className="celda-descarga">
                    <a href={resultado.link} target="_blank" rel="noopener noreferrer" className="btn-descargar">
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

export default Resultados;