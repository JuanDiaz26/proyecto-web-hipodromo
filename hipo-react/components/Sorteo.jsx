import React, { useEffect, useMemo, useRef, useState, version } from 'react';
import './Sorteo.css';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const TOTAL = 15;

const Sorteo = () => {
  const [largada, setLargada] = useState(Array(TOTAL).fill(null)); // fila 1..15 → número sorteado
  const [animando, setAnimando] = useState(false);
  const [ruedaOn, setRuedaOn] = useState(true); // giro suave del bolillero
  const [rollingNumber, setRollingNumber] = useState(null); // número que “rueda” en display
  const [saliendo, setSaliendo] = useState(null); // bola seleccionada, para resaltarla
  const [drawIndex, setDrawIndex] = useState(0); // próxima fila a completar (0..14)
  const [auto, setAuto] = useState(false); // autoplay
  const [historial, setHistorial] = useState([]); // orden de salida

  const completed = drawIndex >= TOTAL;

  // ====== WebAudio: sonidos ======
  const audioCtxRef = useRef(null);
  useEffect(() => {
    audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    return () => {
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close();
      }
    };
  }, []);
  const beep = async (freq = 880, dur = 0.12, type = 'triangle', vol = 0.06) => {
    const ctx = audioCtxRef.current;
    if (!ctx) return;
    if (ctx.state === 'suspended') { try { await ctx.resume(); } catch {} }
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type; o.frequency.value = freq; g.gain.value = vol;
    o.connect(g); g.connect(ctx.destination); o.start(); o.stop(ctx.currentTime + dur);
  };
  const beepDouble = async () => { await beep(820, 0.09); setTimeout(() => { beep(620, 0.09); }, 90); };
  const beepComplete = async () => {
    await beep(520, 0.12, 'sine', 0.07);
    setTimeout(() => { beep(740, 0.14, 'sine', 0.07); }, 120);
    setTimeout(() => { beep(980, 0.18, 'sine', 0.07); }, 280);
  };
  // ===============================

  // Ref con la “largada” más reciente para evitar cierres viejos en autoplay
  const largadaRef = useRef(largada);
  useEffect(() => { largadaRef.current = largada; }, [largada]);

  const calcRemaining = () => {
    const usados = new Set(largadaRef.current.filter(n => n !== null));
    const arr = [];
    for (let i = 1; i <= TOTAL; i++) if (!usados.has(i)) arr.push(i);
    return arr;
  };

  // (Sigue existiendo por si lo usás en otros lados, pero el cálculo “real” lo hago con calcRemaining())
  const remaining = useMemo(() => calcRemaining(), [largada]);

  // Flicker del display mientras anima
  const flickerRef = useRef(null);
  useEffect(() => {
    if (animando) {
      flickerRef.current = setInterval(() => {
        const pool = calcRemaining();
        if (pool.length === 0) return;
        const r = pool[Math.floor(Math.random() * pool.length)];
        setRollingNumber(r);
      }, 60);
    } else {
      clearInterval(flickerRef.current);
      flickerRef.current = null;
    }
    return () => { clearInterval(flickerRef.current); };
  }, [animando]);

  // 👉 Ahora recibe la fila destino explícita para evitar stale state
  const tirarUno = async (targetIndexParam = null) => {
    const targetIndex = targetIndexParam ?? drawIndex;
    if (animando || completed || targetIndex >= TOTAL) return;

    const poolInicio = calcRemaining();
    if (poolInicio.length === 0) return;

    setAnimando(true);
    setRuedaOn(true);

    const durMs = auto ? 900 : 1200; // un toque más rápido en autoplay
    await new Promise(res => setTimeout(res, durMs));

    // Elegimos con pool actualizado (por si hubo cambios entre tanto)
    const pool = calcRemaining();
    if (pool.length === 0) { setAnimando(false); return; }
    const elegido = pool[Math.floor(Math.random() * pool.length)];

    // 🔧 STOP flicker ANTES de mostrar el definitivo
    if (flickerRef.current) { clearInterval(flickerRef.current); flickerRef.current = null; }
    setAnimando(false);            // deja de “rodar” el display
    setRollingNumber(elegido);     // muestra el número real

    // Resalta la bola un instante
    setSaliendo(elegido);
    await new Promise(res => setTimeout(res, 350));

    // Escribe en la fila indicada y avanza el índice
    setLargada(prev => {
      const nuevo = [...prev];
      nuevo[targetIndex] = elegido;
      return nuevo;
    });
    setDrawIndex(targetIndex + 1);
    setHistorial(prev => [...prev, elegido]);

    beepDouble();

    await new Promise(res => setTimeout(res, 150));
    setSaliendo(null);
  };

  // ✅ Autoplay: itera pasando el índice destino (evita usar drawIndex “congelado”)
  const tirarTodos = async () => {
    if (animando || completed) return;
    setAuto(true);
    for (let idx = drawIndex; idx < TOTAL; idx++) {
      // eslint-disable-next-line no-await-in-loop
      await tirarUno(idx);
      // respiro mínimo entre extracciones
      // eslint-disable-next-line no-await-in-loop
      await new Promise(res => setTimeout(res, 100));
    }
    setAuto(false);
  };

  useEffect(() => { if (completed) beepComplete(); }, [completed]);

  const reiniciar = () => {
    clearInterval(flickerRef.current);
    setLargada(Array(TOTAL).fill(null));
    setAnimando(false);
    setRuedaOn(true);
    setRollingNumber(null);
    setSaliendo(null);
    setDrawIndex(0);
    setAuto(false);
    setHistorial([]);
  };

const descargarPDF = () => {
  const doc = new jsPDF("p", "mm", "a4");
  const pageWidth = doc.internal.pageSize.getWidth();
;

  // === Título ===
  doc.setFontSize(18);
  doc.setTextColor(36, 134, 137); // teal
  doc.text("HIPÓDROMO DE TUCUMÁN", pageWidth / 2, 60, { align: "center" });

  doc.setFontSize(16);
  doc.setTextColor(230, 90, 43); // naranja
  doc.text("SORTEO DE PARTIDORES", pageWidth / 2, 70, { align: "center" });

  // Línea separadora
  doc.setDrawColor(36, 134, 137);
  doc.setLineWidth(0.5);
  doc.line(20, 75, pageWidth - 20, 75);

  // === Tabla ===
  const rows = largada.map((num, i) => [i + 1, num ?? "—"]);

  autoTable(doc, {
    head: [["ALFABÉTICO", "LARGADA"]],
    body: rows,
    startY: 85,
    styles: {
      halign: "center",
      valign: "middle",
      fontSize: 11,
    },
    headStyles: {
      fillColor: [36, 134, 137], // teal
      textColor: 255,
      fontStyle: "bold",
    },
    alternateRowStyles: { fillColor: [245, 248, 250] },
    theme: "grid",
  });

  // === Leyenda ===
  const finalY = doc.lastAutoTable.finalY + 12;
  doc.setFontSize(11);
  doc.setTextColor(80, 80, 80);
  doc.text(
    "Sorteo avalado por la Secretaría de Carreras del Hipódromo de Tucumán",
    pageWidth / 2,
    finalY,
    { align: "center" }
  );

  // === Fecha de generación ===
  const fecha = new Date().toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  doc.setFontSize(9);
  doc.setTextColor(130);
  doc.text(`Generado el ${fecha}`, pageWidth - 20, doc.internal.pageSize.height - 10, { align: "right" });

  doc.save("sorteo_partidores.pdf");
};

  return (
    <div className="sorteo-page">
      <header className="sorteo-header">
        <h1 className="titulo-sorteo">Sorteo de Partidores<span className="accent" /></h1>
        <div className="subheader">
          <span className="chip teal">Reunión Nº 19 - 09/11/2025</span>
          <span className="chip orange">Transmisión en vivo</span>
        </div>
      </header>

      <section className="intro">
        <p>El sorteo de partidores se realiza ordenando alfabéticamente los ejemplares inscriptos.
           Luego, se sortean <strong>15 números</strong> al azar y se asignan según ese orden.</p>
      </section>

      <div className="sorteo-grid">
        <div className="col-tabla">
          <div className="card">
            <div className="card-header"><h3>Orden alfabético → Largada</h3></div>
            <table className="sorteo-tabla">
              <thead>
                <tr><th>ALFABÉTICO</th><th>LARGADA</th></tr>
              </thead>
              <tbody>
                {Array.from({ length: TOTAL }, (_, index) => (
                  <tr key={index} className={largada[index] ? 'aparece' : ''}>
                    <td>{index + 1}</td>
                    <td className={largada[index] ? 'cell-fill' : ''}>{largada[index] ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="col-controles">
          <div className="bolillero-card">
            <div className={`bolillero ${ruedaOn ? 'gira' : ''}`}>
              {Array.from({ length: TOTAL }, (_, i) => i + 1).map(n => {
                const yaSalio = !remaining.includes(n);
                const isPick = saliendo === n;
                return (
                  <div key={n} className={`bola ${yaSalio ? 'salio' : ''} ${isPick ? 'pick' : ''}`}>
                    {n}
                  </div>
                );
              })}
            </div>

            <div className={`contador ${completed ? 'done' : ''}`} aria-live="polite">
              {completed ? 'Completado ✅' : <>Sorteo {drawIndex}/{TOTAL}</>}
            </div>

            <div className="display-num" aria-live="polite">
              <span className="label">Número:</span>
              <span className="value">{rollingNumber ?? '—'}</span>
            </div>

            <div className="historial">
              {historial.map((n, i) => (
                <span key={`${n}-${i}`} className="pill" title={`#${i + 1}`}>{n}</span>
              ))}
            </div>

            <div className="panel-controles">
              {!completed && (
                <>
                  <button onClick={() => tirarUno(drawIndex)} className="btn-sorteo" disabled={animando} title="Tirar sorteo (una bola)">
                    {animando ? 'Sorteando…' : '🎬 Tirar sorteo'}
                  </button>
                  <button onClick={tirarTodos} className="btn-auto" disabled={animando || auto} title="Tirar automáticamente todas">
                    ▶️ Tirar todos
                  </button>
                </>
              )}

              <button onClick={descargarPDF} className="btn-descargar" disabled={largada.every(v => v === null)}>
                📄 Descargar PDF
              </button>

              <button className={`btn-reset ${completed ? 'primary' : ''}`} onClick={reiniciar} disabled={animando}>
                {completed ? '🎉 Nuevo sorteo' : '↺ Reiniciar'}
              </button>
            </div>

            <div className="tips">
              <label className="chk">
                <input type="checkbox" checked={ruedaOn} onChange={() => setRuedaOn(v => !v)} />
                Girar bolillero
              </label>
              <small>Se ubican en la tabla en orden 1→15 (alfabético).</small>
            </div>
          </div>
        </div>
      </div>

      <footer className="leyenda-legal">
        Sorteo avalado por la Secretaría de Carreras del Hipódromo de Tucumán
      </footer>
    </div>
  );
};

export default Sorteo;
