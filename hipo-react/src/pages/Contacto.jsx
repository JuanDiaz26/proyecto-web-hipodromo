import React from "react";
import Navbar from "../../components/Navbar";
import "./TablasPages.css";

const Contacto = () => {
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
          <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-record-fill punto-color-titulo" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8 13A5 5 0 1 0 8 3a5 5 0 0 0 0 10" />
          </svg>
          Contacto
        </h3>
      </div>

      <div className="separador-pages"></div>

      <div className="container-contacto">
        <div className="form-contacto-container">
          <div className="form-contacto-header">
            <p>Llena el formulario y nos pondremos en contacto contigo.</p>
          </div>
          <form id="form-contacto" className="form-contacto" action="https://formspree.io/f/xkndvkjb" method="POST">
            <div className="form-group">
              <label htmlFor="nombre"><i className="bi bi-person"></i>Nombre:</label>
              <input className="form-contacto-input" type="text" id="nombre" name="nombre" placeholder="Ingrese su nombre" required />
            </div>
            <div className="form-group">
              <label htmlFor="email"><i className="bi bi-envelope"></i>Email:</label>
              <input className="form-contacto-input" type="email" id="email" name="email" placeholder="Ingrese su email" required />
            </div>
            <div className="form-group">
              <label htmlFor="comentarios"><i className="bi bi-chat-left-text"></i>Mensaje:</label>
              <textarea className="form-contacto-textarea" id="comentarios" name="comentarios" placeholder="Escriba su consulta o mensaje" required></textarea>
            </div>
            <button className="form-contacto-button" type="submit">Consultar</button>
          </form>
        </div>

        <div className="container-telefonos">
          {[
            { icon: "dice-5", title: "Agencias" },
            { icon: "piggy-bank", title: "Tesoreria" },
            { icon: "briefcase", title: "Gerencia de carreras" },
            { icon: "person-badge", title: "Secretaria de carreras" },
            { icon: "book", title: "Escuela de jockeys" },
          ].map((sector, idx) => (
            <div className="container-titulos" key={idx}>
              <i className={`bi bi-${sector.icon}`}></i>
              <div>
                <span className="titulo-sectores">{sector.title}</span><br />
                <span className="descripcion-sectores">
                  <a href="tel:+1234567890">Llamar al +1234567890</a>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
    </>
  );
};

export default Contacto;
