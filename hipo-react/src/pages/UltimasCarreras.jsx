import React from "react";
import Navbar from "../../components/Navbar";
import "./TablasPages.css";

const UltimasCarreras = () => {
  const videos = [
    { carrera: '1º Carrera', 
      subtitulo: 'Premio "Día Mundial de la Higiene"', 
      ganador: 'Lord Lancelot', 
      src: 'https://www.youtube.com/embed/fCQyNCiMkSU?si=5T0BG2dyga31LcgE'
    },
    { carrera: '2º Carrera', 
      subtitulo: 'Premio "Artilu"', 
      ganador: 'El Patriarca', 
      src: 'https://www.youtube.com/embed/jqP0bpHeuqw?si=6KpEfhaPX4aSUrDu' 
    },
    { carrera: '3º Carrera', 
      subtitulo: 'Premio "Tabaiana"', 
      ganador: 'Caetano', 
      src: 'https://www.youtube.com/embed/1Dta32XyNHU?si=9z9eQiGsYL19-vBQ' 
    },
    { carrera: '4º Carrera', 
      subtitulo: 'Premio "Taraza"', 
      ganador: 'Nayla Plus', 
      src: 'https://www.youtube.com/embed/1-bC3ui2Fro?si=AesRzVDJyGM3Az_h' 
    },
    { carrera: '5º Carrera', 
      subtitulo: 'Concertada', 
      ganador: 'Tormentoso', 
      src: 'https://www.youtube.com/embed/NpAl2e6vujA?si=3G9vxbmv6yFWOcSI' 
    },
    { carrera: '6º Carrera', 
      subtitulo: 'Premio "Adolfo Aguilar"', 
      ganador: 'Low Fool', 
      src: 'https://www.youtube.com/embed/t5RvXCRjO24?si=K1V2-FqhuEGgL0WK' 
    },
    { carrera: '7º Carrera', 
      subtitulo: 'Premio "Francisco Llanes"', 
      ganador: 'Jan de Liche', 
      src: '' // Sin video
    },
    { carrera: '8º Carrera', 
      subtitulo: 'Premio "Domingo Faustino Sarmiento"', 
      ganador: 'Smashing Master', 
      src: 'https://www.youtube.com/embed/dp3HSWIMcUk?si=h_6JQMf-DHu-SQOf' 
    },
    { carrera: '9º Carrera', 
      subtitulo: 'Premio "Día del Inmigrante"', 
      ganador: 'Smiling Nich', 
      src: 'https://www.youtube.com/embed/b4rIQN0J9RI?si=6hLK27mdrAkJXQVp' 
    },
    { carrera: '10º Carrera', 
      subtitulo: 'Especial "Oscar N. Bravo"', 
      ganador: 'Twitch Hurricane', 
      src: 'https://www.youtube.com/embed/-57rr4UPQys?si=2r4RcQRgd4rLMCrH' 
    },
    { carrera: '11º Carrera', 
      subtitulo: 'Premio "Día del Maestro"', 
      ganador: 'Lord of Moyvore', 
      src: 'https://www.youtube.com/embed/uDMN0JSfsEY?si=azBTiGBNjid2J2vw' 
    },
  ];

  return (
    <>
      <header className="header-pages">
        <div className="navbar-wrapper">
            <Navbar />
        </div>
      </header>

      <main className="main-inicio main-pages">
        {/* Botón Flotante WhatsApp */}
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
            {/* Icono de Play */}
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-play-circle-fill punto-color-titulo" viewBox="0 0 16 16">
              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM6.79 5.093A.5.5 0 0 0 6 5.5v5a.5.5 0 0 0 .79.407l3.5-2.5a.5.5 0 0 0 0-.814l-3.5-2.5z"/>
            </svg>
            ÚLTIMAS CARRERAS
          </h3>
        </div>

        <div className="separador-pages"></div>

        {/* Usamos 'container' de bootstrap en lugar de 'container-programas' para tener más ancho para los videos */}
        <div className="container mt-4 pb-5">
          <div className="row justify-content-center">
            {videos.map((video, index) => (
              <div className="col-12 col-md-6 col-lg-4 mb-4" key={index}>
                {/* Tarjeta con estilo consistente (Bordes redondeados, sombra suave) */}
                <div className="card h-100 border-0 shadow-sm" style={{ borderRadius: '12px', overflow: 'hidden' }}>
                  
                  {/* Video arriba para mejor estética */}
                  <div className="ratio ratio-16x9 bg-light">
                    {video.src ? (
                      <iframe
                        className="iframe-video"
                        src={video.src}
                        title={`Video ${index + 1}`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                        style={{ border: 0 }}
                      ></iframe>
                    ) : (
                      <div className="d-flex align-items-center justify-content-center text-muted">
                        <small>Video no disponible</small>
                      </div>
                    )}
                  </div>

                  <div className="card-body text-center p-3">
                    <h5 className="card-title" style={{ color: '#F16536', fontSize: '1.1rem', fontWeight: '700', borderBottom: '2px solid #248589', paddingBottom: '8px', marginBottom: '10px' }}>
                      {video.carrera}
                    </h5>
                    <h6 className="card-subtitle mb-2 text-muted" style={{ fontSize: '0.9rem' }}>
                      {video.subtitulo}
                    </h6>
                    <p className="card-text mt-3">
                      <i className="bi bi-award-fill medalla-oro me-1"></i> 
                      <span style={{ fontWeight: '600', color: '#333' }}>{video.ganador}</span>
                    </p>
                  </div>

                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
};

export default UltimasCarreras;