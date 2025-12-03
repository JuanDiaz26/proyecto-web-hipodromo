import React from "react";
import Navbar from "../../components/Navbar"; 
import "./TablasPages.css"; 

const cartas = [
  { titulo: "Llamado a inscriptos - 24 de Septiembre", link: "https://drive.google.com/file/d/1FBjG8mBKgR4Lj4GYYTSqCacD9SOmsxUc/view?usp=sharing" },
  { titulo: "Llamado a inscriptos - 7 de Septiembre",  link: "https://drive.google.com/file/d/1tFF2M7c_uSdQp17lIZwaByxb5Rd-qWr0/view?usp=sharing" },
  { titulo: "Llamado a inscriptos - 24 de Agosto",     link: "https://drive.google.com/file/d/1lrP6lNi696RXXpvla1spCsWXBNy4Rh1z/view?usp=sharing" },
  { titulo: "Llamado a inscriptos - 10 de Agosto",     link: "https://drive.google.com/file/d/1iZrKNUZRSwNYqVHoUQri_eIYqMFtiZB7/view?usp=sharing" },
  { titulo: "Llamado a inscriptos - 27 de Julio",      link: "https://drive.google.com/file/d/1HCLm5401bolz8h57GcURfotOt0rIliG5/view?usp=sharing" },
  { titulo: "Llamado a inscriptos - 13 de Julio",      link: "https://drive.google.com/file/d/1AwH6LA0TGzKz7snqF_oedPGpB5wYof58/view?usp=sharing" },
  { titulo: "Llamado a inscriptos - 22 de Junio",      link: "https://drive.google.com/file/d/17y-MTsbEMg153Rn8k7uP7ZUEFPAvXkIC/view?usp=sharing" },
  { titulo: "Llamado a inscriptos - 8 de Junio",       link: "https://drive.google.com/file/d/1_zgqwu4F2y7w55LY3vYgS363-_oUiFFx/view?usp=sharing" },
  { titulo: "Llamado a inscriptos - 25 de Mayo",       link: "https://drive.google.com/file/d/1ZK6PxsTaGYK-96Fi1hV1DWdLhkiJ-sAy/view?usp=sharing" },
  { titulo: "Llamado a inscriptos - 11 de Mayo",       link: "https://drive.google.com/file/d/10ZQJxCqC8Fu96s1WS6v4UiyeCuF8Uoqv/view?usp=sharing" },
  { titulo: "Llamado a inscriptos - 26 de Abril",      link: "https://drive.google.com/file/d/1mcfTnIHyKXhrwIQ4BiwxAzIYgMb3qZLd/view?usp=sharing" },
  { titulo: "Llamado a inscriptos - 13 de Abril",      link: "https://drive.google.com/file/d/1p96g1GzzBXT6pcl7K6is_WJW1v7U4goq/view?usp=sharing" },
  { titulo: "Llamado a inscriptos - 30 de Marzo",      link: "https://drive.google.com/file/d/1o_OdcB4Le4nGdlcCOIXCLZcRQhxADaok/view?usp=sharing" },
  { titulo: "Llamado a inscriptos - 16 de Marzo",      link: "https://drive.google.com/file/d/1mirjywu6NFGOzF_ASoCeSySHOtAxiWoT/view?usp=sharing" },
  { titulo: "Llamado a inscriptos - 23 de Febrero",    link: "https://drive.google.com/file/d/15cDaROkxO00rcsCmdZc9tj-dyugFfITk/view?usp=sharing" },
  { titulo: "Llamado a inscriptos - 16 de Febrero",    link: "https://drive.google.com/file/d/1X3M9XFSbKuEXWTs4CuAM969-myyXFsmN/view?usp=sharing" },
];

const Cartas = () => {
  return (
    <>
      <header className="header-pages">
        <div className="navbar-wrapper">
            <Navbar />
        </div>
      </header>

      <main className="main-inicio main-pages">
        {/* Icono de WhatsApp mantenido */}
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
          {/* Clase titulo-programas agregada para estilo consistente */}
          <h3 className="titulo-pages titulo-programas">
            {/* Icono de Sobre/Carta */}
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-envelope-paper-fill punto-color-titulo" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M6.5 9.5 3 7.5v-6A1.5 1.5 0 0 1 4.5 0h7A1.5 1.5 0 0 1 13 1.5v6l-3.5 2L8 8.75l-1.5.75ZM1.059 3.635 2 3.133v3.753L0 5.713V5.4a2 2 0 0 1 1.059-1.765ZM16 5.713l-2 1.173V3.133l.941.502A2 2 0 0 1 16 5.4v.313Zm0 1.16-5.693 3.337L16 13.372v-6.5Zm-8 3.199 7.941 4.412A2 2 0 0 1 14 16H2a2 2 0 0 1-1.941-1.516L8 10.072Zm-8 3.3 5.693-3.162L0 6.873v6.5Z"/>
            </svg>
            CARTAS DE LLAMADAS
          </h3>
        </div>

        <div className="separador-pages"></div>

        <div className="container-programas">
          <table>
            <thead>
              <tr>
                <th className="th-nombre-reunion">DOCUMENTO Y FECHA</th>
                <th className="th-descarga">DESCARGAR</th>
              </tr>
            </thead>
            <tbody>
              {cartas.map((carta, i) => (
                <tr key={i} className="programa-row">
                  <td className="celda-nombre">{carta.titulo.toUpperCase()}</td>
                  <td className="celda-descarga">
                    <a href={carta.link} target="_blank" rel="noopener noreferrer" className="btn-descargar">
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

export default Cartas;