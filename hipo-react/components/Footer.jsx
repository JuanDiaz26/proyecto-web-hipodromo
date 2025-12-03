import React from 'react';
import './Footer.css'; // Asegurate de importar tus estilos acá

const Footer = () => {
  return (
    <footer className="footer-inicio">
      <div className="contenedorPrincipalFooter">
        {/* Redes Sociales */}
        <div className="container-footer">
          <h2 className="titulo-footer">Seguinos</h2>
          <div className="enlaces-footer">
            <div className="contenedor-icono-redes">
              <a href="https://www.facebook.com/hipodromotuc" target="_blank" rel="noopener noreferrer" title="Visita nuestra página de Facebook">
                <i className="bi bi-facebook icono-footer"></i>
                <span className="text-footer-display">Facebook</span>
              </a>
            </div>
            <div className="contenedor-icono-redes">
              <a href="https://wa.me/+5493812067808?text=Hola%20buenas,%20una%20consulta." target="_blank" rel="noopener noreferrer" title="Hace tu consulta mediante nuestro chat de whatsapp">
                <i className="bi bi-whatsapp icono-footer"></i>
                <span className="text-footer-display">Whatsapp</span>
              </a>
            </div>
            <div className="contenedor-icono-redes">
              <a href="https://www.instagram.com/hipodromodetucuman/" target="_blank" rel="noopener noreferrer" title="Visita nuestra página de Instagram">
                <i className="bi bi-instagram icono-footer"></i>
                <span className="text-footer-display">Instagram</span>
              </a>
            </div>
            <div className="contenedor-icono-redes">
              <a href="https://www.youtube.com/@HipodromodeTucuman" target="_blank" rel="noopener noreferrer" title="Visita nuestra página de Youtube">
                <i className="bi bi-youtube icono-footer"></i>
                <span className="text-footer-display">Youtube</span>
              </a>
            </div>
          </div>
        </div>

        {/* Contacto */}
        <div className="container-footer">
          <h2 className="titulo-footer">Contacto</h2>
          <div className="contacto-footer">
            <div className="contenedor-text-footer">
              <i className="bi bi-telephone-fill"></i>
              <span className="text-footer">Teléfono: </span>
              <a href="tel:03814311162">0381 431-1162</a>
            </div>
            <div className="contenedor-text-footer">
              <i className="bi bi-envelope-at-fill"></i>
              <span className="text-footer">Correo: </span>
              <a href="mailto:hipodromotuc@gmail.com">hipodromotuc@gmail.com</a>
            </div>
            <div className="contenedor-text-footer">
              <i className="bi bi-geo-alt-fill"></i>
              <span className="text-footer">
                Dirección: Av. Irineo Leguisamo 800, T4000 San Miguel de Tucumán, Tucumán.
              </span>
            </div>
          </div>
        </div>

        {/* Institucional */}
        <div className="container-footer">
          <h2 className="titulo-footer">Institucional</h2>
          <div className="enlaces-institucional-footer">
            <a href="/historia">Historia</a>
            <a href="/museo">Museo del Turf</a>
            <a href="/escuela">Escuela de Jockeys</a>
          </div>
        </div>
      </div>

      {/* Pie de página */}
      <div className="container-bottom-footer">
        <p className="copyright">
          &copy; 2025 Hipódromo de Tucumán. Administrado por la Caja Popular de Ahorros. 
        </p>
      </div>
    </footer>
  );
};

export default Footer;
