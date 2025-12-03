import React, { useEffect, useRef, useState } from "react";
import "./SpotBatalla.css";

const SpotBatalla = () => {
  const videoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    v.loop = true;
    v.playsInline = true;
    v.preload = "metadata";
    v.play().catch(() => {});
  }, []);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) v.play();
    else v.pause();
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    if (isMuted) {
      v.muted = false;
      v.volume = 0.8;
      setIsMuted(false);
      if (v.paused) v.play();
    } else {
      v.muted = true;
      setIsMuted(true);
    }
  };

  return (
<section className="spot-batalla-section position-relative">
  {/* Overlays */}
  <div className="spot-bg-gradient position-absolute top-0 start-0 w-100 h-100"></div>
  <div className="spot-bg-tint position-absolute top-0 start-0 w-100 h-100"></div>

  <div className="container position-relative z-1 py-5">
    {/* Encabezado NUEVO */}
    <div className="spot-heading text-center text-lg-start mb-4">
      <span className="spot-kicker">Spot oficial</span>
    
      <h2 className="spot-title">
        Gran Premio Batalla de Tucumán
      </h2>
    
      <div className="spot-underline" aria-hidden="true"></div>
    
      <div className="spot-subtitle mt-2">
        <i className="bi bi-calendar-event"></i>
        <span>24 de Septiembre</span>
      </div>
    </div>

    {/* Split 50/50 */}
    <div className="row g-4 align-items-center">
      {/* Izquierda: Video */}
      <div className="col-12 col-lg-7">
        <div className="spot-video">
          <video
            ref={videoRef}
            className="w-100 h-100 rounded shadow"
            onClick={togglePlay}
            onKeyDown={(e) => (e.key === " " || e.key === "Enter") && togglePlay()}
            role="button"
            tabIndex={0}
            aria-label="Reproducir/pausar spot oficial del Gran Premio Batalla de Tucumán"
          >
            <source src="/video-spot.mp4" type="video/mp4" />
            Tu navegador no soporta el elemento de video.
          </video>

          <button
            type="button"
            className="spot-sound-toggle btn btn-light btn-sm"
            onClick={toggleMute}
            aria-label={isMuted ? "Activar sonido (80%)" : "Silenciar"}
            title={isMuted ? "Activar sonido (80%)" : "Silenciar"}
          >
            <i className={`bi ${isMuted ? "bi-volume-mute" : "bi-volume-up"}`}></i>
          </button>
        </div>
      </div>

      {/* Derecha: Texto + CTAs */}
      <div className="col-12 col-lg-5">
        <div className="spot-info text-center text-lg-start ms-lg-3">
          <p className="text-white mb-4 spot-copy">
            Disfrutá del espectáculo hípico más importante del norte argentino:
            los mejores ejemplares y jinetes en el Hipódromo de Tucumán.
            Una jornada de emoción y pasión por las carreras.
          </p>

          <div className="d-flex flex-column flex-sm-row gap-3">
            <a href="/programas"  className="btn btn-spot-outline btn-lg fw-semibold px-4 py-2">
              Programas
            </a>
            <a href="/resultados" className="btn btn-spot-outline btn-lg fw-semibold px-4 py-2">
              Resultados
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
  );
};

export default SpotBatalla;
