import React from "react";
import "./Noticias.css";

// 👇 Sin import: usamos rutas absolutas desde /public/assets
const noticias = [
  {
  id: 1,
  titulo: 'Suffok se consagró en el Gran Premio "Batalla de Tucumán"',
  texto: `Suffok, con Facundo R. Morán y del stud L.C.J., ganó el Gran Premio "Batalla de Tucumán" (2.200 m), superando a Dr. Legasov y Laudrup. Suma 6 victorias en 13 salidas.`,
  imagen: "/noticia-1.webp",
  fecha: "24Sep25",
  video: "https://www.youtube.com/watch?v=XXXXXXXXXXX"
},
{
  id: 2,
  titulo: 'Smiling Nich brilló en el Clásico "Fundación Equina Argentina"',
  texto: `Smiling Nich, con Ángel N. Vai y del stud María Isabel, se impuso en el Clásico "Fundación Equina Argentina" (1.400 m), escoltado por Mock Joy y The Coach. Acumula 3 triunfos en 4 salidas.`,
  imagen: "/noticia-2.webp",
  fecha: "24Sep25",
  video: "https://www.youtube.com/watch?v=XXXXXXXXXXX"
},
{
  id: 3,
  titulo: 'Storm Chuck se quedó con el Clásico "Estrellas Tucumanas"',
  texto: `Storm Chuck, con Ángel N. Vai y del stud María Isabel, venció en el Clásico "Estrellas Tucumanas" (1.500 m), superando a Malo de Película y Paladín Oriental. Lleva 6 triunfos en 9 carreras.`,
  imagen: "/noticia-3.webp",
  fecha: "24Sep25",
  video: "https://www.youtube.com/watch?v=XXXXXXXXXXX"
},

];

const Noticias = () => {
  return (
    <section className="main-noticias">
      <h2 className="titulo-seccion">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="25"
          height="25"
          fill="currentColor"
          className="bi bi-record-fill punto-color-titulo"
          viewBox="0 0 16 16"
        >
          <path fillRule="evenodd" d="M8 13A5 5 0 1 0 8 3a5 5 0 0 0 0 10z" />
        </svg>
        Noticias
      </h2>

      <div className="contenedor-noticias">
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-2 row-cols-lg-3 g-1">
          {noticias.map((noti) => (
            <div className="col" key={noti.id}>
              <div className="card h-100">
                <img
                  src={noti.imagen}
                  className="card-img-top"
                  alt={noti.titulo}
                  loading="lazy"
                />
                <div className="card-body-noti">
                  <h5 className="card-titulo-noti">{noti.titulo}</h5>
                  <p className="card-parrafo-noti">{noti.texto}</p>
                </div>
                <div className="mt-auto">
                  <div className="card-footer d-flex align-items-center">
                    <small className="text-muted">
                      <i className="bi bi-calendar-date text-secondary"></i>{" "}
                      {noti.fecha}
                    </small>

                    {noti.video && (
                      <a
                        href={noti.video}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ms-auto video"
                      >
                        <i className="bi bi-youtube i-youtu"></i>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Noticias;
