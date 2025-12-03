import React from "react";
import Navbar from "../../components/Navbar";
import "./TablasPages.css";

// =================== META (editables) ===================
const REUNION_NUM = 15;
const REUNION_FECHA = ""; // Opcional (ej: "24 de Agosto de 2025"); si queda vacío, no se muestra

// =================== DATOS (Reunión Nº 15) ===================
const DATA = {
  jockeys: [
    { nombre: "VIZCARRA, Jose Alfredo", oficial: 24, extra: 11 },
    { nombre: "SUAREZ, Hector Ariel", oficial: 16, extra: 4 },
    { nombre: "BRITO, Francisco Martin", oficial: 10, extra: 1 },
    { nombre: "RODRIGUEZ, Matias Agustin", oficial: 8, extra: 2 },
    { nombre: "MORAN, Facundo Ricardo", oficial: 7, extra: 3 },
    { nombre: "VAI, Angel Nazareno", oficial: 7, extra: 0 },
    { nombre: "CAMOS, Ruben Oscar", oficial: 5, extra: 2 },
    { nombre: "OSSAN, Benjamin", oficial: 4, extra: 1 },
    { nombre: "CARAM, Cristian Adrian", oficial: 3, extra: 2 },
    { nombre: "ALARCON, Pablo Javier", oficial: 3, extra: 1 },
    { nombre: "MARRADES, Walter Maximiliano", oficial: 3, extra: 1 },
    { nombre: "RUIZ, Roberto Manuel", oficial: 3, extra: 0 },
    { nombre: "BETHENCOURT, Julian Enrique", oficial: 2, extra: 2 },
    { nombre: "CARRIZO, José Benito", oficial: 2, extra: 0 },
    { nombre: "VALDEZ, Raul", oficial: 2, extra: 0 },
    { nombre: "MEDINA, Lucas Santiago", oficial: 1, extra: 1 },
    { nombre: "AGUIRREZ, Jorge Agustin", oficial: 1, extra: 0 },
    { nombre: "ROBLEDO, Roberto Damian", oficial: 1, extra: 0 },
    { nombre: "SALAZAR, Ramiro Exequiel", oficial: 1, extra: 0 },
    { nombre: "VILLEGAS, Angel Sebastian", oficial: 1, extra: 0 },
    { nombre: "GONZALEZ, Lucas", oficial: 0, extra: 2 },
    { nombre: "FIGUEROA, Walter Anibal", oficial: 0, extra: 1 },
    { nombre: "ROJAS, Cristian Nahuel", oficial: 0, extra: 1 },
  ],
  cuidadores: [
    { nombre: "ASSAD, Cesar Alberto", oficial: 14, extra: 0 },
    { nombre: "SAEZ, Juan Edmundo", oficial: 10, extra: 1 },
    { nombre: "BRITO, Luis Orlando", oficial: 5, extra: 3 },
    { nombre: "GOMEZ OMIL, German", oficial: 5, extra: 2 },
    { nombre: "GALLEGO, Jose Miguel", oficial: 5, extra: 1 },
    { nombre: "JIMENEZ, Juan Francisco", oficial: 4, extra: 1 },
    { nombre: "NIEVA, Sergio Rene", oficial: 4, extra: 1 },
    { nombre: "CHIRINO, Carlos Alberto", oficial: 4, extra: 0 },
    { nombre: "MEDINA, Roberto Miguel", oficial: 4, extra: 0 },
    { nombre: "RAMOS, Daniel Sebastian", oficial: 3, extra: 7 },
    { nombre: "TEJEDA, Juan Alberto", oficial: 3, extra: 2 },
    { nombre: "JAIME, Alexis José", oficial: 3, extra: 1 },
    { nombre: "CUELLAR, Sergio David", oficial: 3, extra: 0 },
    { nombre: "NOGUERA ASSAD, Lazaro", oficial: 3, extra: 0 },
    { nombre: "PALMA, Manuel Segundo", oficial: 3, extra: 0 },
    { nombre: "PIQUERA, Gaston S.", oficial: 3, extra: 0 },
    { nombre: "RODRIGUEZ, Rafael Orlando", oficial: 3, extra: 0 },
    { nombre: "SPEZIALE, Sergio Miguel", oficial: 3, extra: 0 },
    { nombre: "VALDEZ, Gustavo Josue", oficial: 2, extra: 3 },
    { nombre: "LEGUIZAMON, Guillermo Alberto", oficial: 2, extra: 2 },
    { nombre: "MURATORE, Francisco Ramon", oficial: 2, extra: 2 },
    { nombre: "PERALTA, Hector Daniel", oficial: 2, extra: 1 },
    { nombre: "SUAREZ. Marcelo Osvaldo", oficial: 2, extra: 1 },
    { nombre: "FRIAS, Jose Luis", oficial: 2, extra: 0 },
    { nombre: "MURATORE, Daniel Rosario", oficial: 2, extra: 0 },
    { nombre: "JIMENEZ, Hector Victor", oficial: 1, extra: 1 },
    { nombre: "REY, Guillermo Omar", oficial: 1, extra: 1 },
    { nombre: "BARRIENTOS, Daniel David", oficial: 1, extra: 0 },
    { nombre: "JAIME, Hector Rodolfo", oficial: 1, extra: 0 },
    { nombre: "JIMENEZ, Guillermo Antonio", oficial: 1, extra: 0 },
    { nombre: "MARTIN, Jorge Luis", oficial: 1, extra: 0 },
    { nombre: "SOLORZANO, Mariela Del Valle", oficial: 1, extra: 0 },
    { nombre: "VILDOZA, Enrique Fabian", oficial: 1, extra: 0 },
    { nombre: "ALDERETE, Enrique José", oficial: 0, extra: 1 },
    { nombre: "FRIAS, Angel Antonio", oficial: 0, extra: 1 },
    { nombre: "LAZARTE, Hugo Alberto", oficial: 0, extra: 1 },
    { nombre: "LOBO, Maria de los Angeles", oficial: 0, extra: 1 },
    { nombre: "SEME, Julio Orlando", oficial: 0, extra: 1 },
  ],
  caballerizas: [
    { nombre: "ABUELA TETE", oficial: 9, extra: 1 },
    { nombre: "MONTERRICO", oficial: 5, extra: 0 },
    { nombre: "SEBA Y CAMI", oficial: 4, extra: 2 },
    { nombre: "LOS MOLESTOS", oficial: 4, extra: 1 },
    { nombre: "MARIA ISABEL", oficial: 4, extra: 1 },
    { nombre: "DON VALIENTE", oficial: 4, extra: 0 },
    { nombre: "RUBIO'S", oficial: 3, extra: 5 },
    { nombre: "EL PILI", oficial: 3, extra: 1 },
    { nombre: "GRAND EDUARD", oficial: 3, extra: 1 },
    { nombre: "5 DE COPAS", oficial: 3, extra: 0 },
    { nombre: "COCO JEREZ", oficial: 3, extra: 0 },
    { nombre: "DEL VALLE A.A.", oficial: 3, extra: 0 },
    { nombre: "EL PRODE", oficial: 3, extra: 0 },
    { nombre: "L.C.J.", oficial: 3, extra: 0 },
    { nombre: "LOS 4 DE CORDOBA (SDE)", oficial: 3, extra: 0 },
    { nombre: "TRAMO 20 (SDE)", oficial: 3, extra: 0 },
    { nombre: "EL PONY LEGUIZAMON", oficial: 2, extra: 2 },
    { nombre: "ESMERALDA", oficial: 2, extra: 1 },
    { nombre: "LOS TIOS", oficial: 2, extra: 1 },
    { nombre: "C.H. - BDC", oficial: 2, extra: 0 },
    { nombre: "EST. SAN GREGORIO (SDE)", oficial: 2, extra: 0 },
    { nombre: "LAS 4 HERMANAS (SDE)", oficial: 2, extra: 0 },
    { nombre: "LOS MOLESTINES", oficial: 2, extra: 0 },
    { nombre: "OJO TURCO", oficial: 2, extra: 0 },
    { nombre: "DON PABLO", oficial: 1, extra: 2 },
    { nombre: "BANDINI", oficial: 1, extra: 1 },
    { nombre: "CHANTA", oficial: 1, extra: 1 },
    { nombre: "DON SILVERIO", oficial: 1, extra: 1 },
    { nombre: "EL BALON", oficial: 1, extra: 1 },
    { nombre: "MINGO Y JUANJO", oficial: 1, extra: 1 },
    { nombre: "4 PLUMA", oficial: 1, extra: 0 },
    { nombre: "BENITO A. Y J.R.", oficial: 1, extra: 0 },
    { nombre: "BETO", oficial: 1, extra: 0 },
    { nombre: "CELE Y SABRI", oficial: 1, extra: 0 },
    { nombre: "CUATRO SOLES", oficial: 1, extra: 0 },
    { nombre: "DON ANTONIO", oficial: 1, extra: 0 },
    { nombre: "E.S.T. PIEDRA GRANDE", oficial: 1, extra: 0 },
    { nombre: "EL CALIFA", oficial: 1, extra: 0 },
    { nombre: "EL TRIANGULO", oficial: 1, extra: 0 },
    { nombre: "ESPERANZA", oficial: 1, extra: 0 },
    { nombre: "JUANJO", oficial: 1, extra: 0 },
    { nombre: "LOS CAMIONEROS", oficial: 1, extra: 0 },
    { nombre: "LUZ DE LUJAN", oficial: 1, extra: 0 },
    { nombre: "MARIA LAURA", oficial: 1, extra: 0 },
    { nombre: "NICOLAS T.", oficial: 1, extra: 0 },
    { nombre: "NORITA", oficial: 1, extra: 0 },
    { nombre: "PAPITO JAVIER", oficial: 1, extra: 0 },
    { nombre: "PETY", oficial: 1, extra: 0 },
    { nombre: "PIEDRA GRANDE", oficial: 1, extra: 0 },
    { nombre: "PILAR DEL SOL", oficial: 1, extra: 0 },
    { nombre: "SANTA FEDERACION (SDE)", oficial: 1, extra: 0 },
    { nombre: "TIBY", oficial: 1, extra: 0 },
    // Solo extraoficiales:
    { nombre: "DON JULIO", oficial: 0, extra: 2 },
    { nombre: "LOS CERRILLOS DE SALTA", oficial: 0, extra: 2 },
    { nombre: "ANTO Y NAHUEL", oficial: 0, extra: 1 },
    { nombre: "BARCELONA", oficial: 0, extra: 1 },
    { nombre: "DON ALFREDO", oficial: 0, extra: 1 },
    { nombre: "JUAN FRIAS", oficial: 0, extra: 1 },
    { nombre: "LA VICTORIA (CBA)", oficial: 0, extra: 1 },
    { nombre: "LOS AMIGOS DE CUTIN", oficial: 0, extra: 1 },
    { nombre: "LOS EXTRADITABLES", oficial: 0, extra: 1 },
    { nombre: "STUD MANOS BRUJAS", oficial: 0, extra: 1 },
  ],
};

// ============ Helpers ============
const totalOficial = (arr) => arr.reduce((acc, x) => acc + (x.oficial || 0), 0);
const totalExtra = (arr) => arr.reduce((acc, x) => acc + (x.extra || 0), 0);

// Tabla genérica
function TablaEstadisticas({ id, titulo, items, encabezadoNombre }) {
  return (
    <>
      <div className="titulo-estadisticas" id={id}>
        <strong>
          {titulo} — A la Reunión Nº {REUNION_NUM}
          {REUNION_FECHA ? ` (${REUNION_FECHA})` : ""}
        </strong>
      </div>

      <table id={id === "jockeys" ? "jockeys" : undefined}>
        <thead>
          <tr>
            <th className="titulos-tabla th-number">Nº</th>
            <th className="titulos-tabla th-nombre">{encabezadoNombre}</th>
            <th className="titulos-tabla th-ofic">Ofic</th>
            <th className="titulos-tabla th-ofic">Ext.Ofic</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, idx) => (
            <tr key={item.nombre} className="filas-estadisticas">
              <td className="tabla-text-negro">{idx + 1}º</td>
              <td className="tabla-text-negro">{item.nombre}</td>
              <td>{item.oficial || 0}</td>
              <td>{item.extra || 0}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td></td>
            <td className="tabla-text-negro">Totales</td>
            <td>{totalOficial(items)}</td>
            <td>{totalExtra(items)}</td>
          </tr>
        </tfoot>
      </table>
    </>
  );
}

const Estadisticas = () => {
  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

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
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-bar-chart-fill punto-color-titulo" viewBox="0 0 16 16">
              <path d="M1 11a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1v-3zm5-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7zm5-5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1V2z"/>
            </svg>
            ESTADÍSTICAS
          </h3>
        </div>

        <div className="separador-pages"></div>

        <div className="botonesNav">
          <button className="button buttonWpApostar" onClick={() => scrollToSection("jockeys")}>
            <span className="button-content button-est">Jockeys</span>
          </button>
          <button className="button buttonWpApostar" onClick={() => scrollToSection("cuidadores")}>
            <span className="button-content button-est">Cuidadores</span>
          </button>
          <button className="button buttonWpApostar" onClick={() => scrollToSection("caballerizas")}>
            <span className="button-content button-est">Caballerizas</span>
          </button>
        </div>

        {/* IMPORTANTE: Usamos 'container-programas' para heredar el ancho controlado (max-width: 750px) */}
        <div className="container-programas">
          <TablaEstadisticas
            id="jockeys"
            titulo="Estadísticas Jockeys 2025"
            items={DATA.jockeys}
            encabezadoNombre="Jockeys"
          />
          <TablaEstadisticas
            id="cuidadores"
            titulo="Estadísticas Cuidadores 2025"
            items={DATA.cuidadores}
            encabezadoNombre="Cuidadores"
          />
          <TablaEstadisticas
            id="caballerizas"
            titulo="Estadísticas Caballerizas 2025"
            items={DATA.caballerizas}
            encabezadoNombre="Caballerizas"
          />
        </div>
      </main>
    </>
  );
};

export default Estadisticas;