import React, { useState, useEffect } from 'react';

// --- Estilos CSS Profesionales V6 (Título chico, Botones Múltiples, Alineación) ---
const styles = `
  /* RESET & BASE */
  * { box-sizing: border-box; }
  
  body {
    margin: 0;
    background-color: #f4f6f8;
  }

  .app-container {
    font-family: 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    padding: 40px 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
  }

  /* --- HEADER (Título más chico y centrado) --- */
  .main-header {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin-bottom: 30px;
  }
  
  .title-primary {
    font-size: 1.8rem; /* REDUCIDO: Antes 2.5rem */
    color: #0f2c58;
    margin: 0;
    font-weight: 900;
    letter-spacing: -0.5px;
    text-transform: uppercase;
    display: inline-block;
  }
  
  /* --- TARJETA DE BÚSQUEDA --- */
  .search-card {
    background: white;
    width: 100%;
    max-width: 1250px;
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.06);
    overflow: visible; 
    margin-bottom: 20px;
    border: 1px solid #e1e4e8;
    position: relative;
    z-index: 50; 
  }

  /* --- TABS --- */
  .search-tabs {
    display: flex;
    background: white;
    border-bottom: 1px solid #eee;
    border-radius: 8px 8px 0 0;
  }
  .search-tab {
    flex: 1;
    padding: 18px;
    text-align: center;
    cursor: pointer;
    font-weight: 600;
    color: #8898aa;
    transition: all 0.2s ease;
    border-bottom: 3px solid transparent;
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  .search-tab:hover { color: #1a3c6d; background-color: #f8f9fe; }
  .search-tab.active { color: #1a3c6d; border-bottom-color: #1a3c6d; }

  /* --- INPUT --- */
  .search-body { padding: 30px; background-color: white; border-radius: 0 0 8px 8px; }
  .search-input-group { position: relative; display: flex; gap: 10px; }
  .search-input-wrapper { position: relative; flex-grow: 1; }

  .main-input {
    width: 100%; padding: 14px 18px; font-size: 1.1rem;
    border: 1px solid #d1d7e0; border-radius: 6px;
    transition: border-color 0.2s; outline: none;
  }
  .main-input:focus { border-color: #1a3c6d; box-shadow: 0 0 0 3px rgba(26, 60, 109, 0.1); }

  .btn-search {
    padding: 0 35px; background-color: #1a3c6d; color: white;
    border: none; border-radius: 6px; font-size: 1rem; font-weight: 700;
    cursor: pointer; transition: background 0.2s; text-transform: uppercase;
  }
  .btn-search:hover { background-color: #142d52; }

  /* --- SUGERENCIAS FLOTANTES (Input) --- */
  .suggestions-dropdown {
    position: absolute; top: 100%; left: 0; right: 0;
    background: white; border: 1px solid #e1e4e8; border-top: none;
    border-radius: 0 0 6px 6px; box-shadow: 0 10px 25px rgba(0,0,0,0.15);
    list-style: none; padding: 0; margin: 0; z-index: 1000;
    max-height: 250px; overflow-y: auto;
  }
  .suggestion-item {
    padding: 12px 20px; cursor: pointer; font-size: 1rem; color: #333;
    border-bottom: 1px solid #f0f0f0; text-transform: uppercase;
  }
  .suggestion-item:last-child { border-bottom: none; }
  .suggestion-item:hover { background-color: #f1f4f8; color: #1a3c6d; font-weight: 600; }

  /* --- RESULTADOS MÚLTIPLES (BOTONES RESTAURADOS) --- */
  .multiple-results {
    margin-top: 20px;
    border-top: 1px solid #eee;
    padding-top: 20px;
  }
  .multiple-header { 
    font-size: 1rem; color: #666; margin-bottom: 15px; font-weight: 600; 
  }
  /* Grilla de botones */
  .multiple-list { 
    list-style: none; padding: 0; display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 10px; 
  }
  /* Estilo de botón lindo */
  .multiple-item {
    background: #f8f9fa; padding: 12px; border-radius: 6px; text-align: center; border: 1px solid #e9ecef;
    cursor: pointer; font-weight: 600; color: #1a3c6d; font-size: 0.9rem; transition: all 0.2s;
    text-transform: uppercase;
  }
  .multiple-item:hover { 
    background: #1a3c6d; color: white; border-color: #1a3c6d;
  }

  /* --- MENSAJES --- */
  .status-msg { margin-top: 15px; padding: 12px; border-radius: 6px; text-align: center; font-size: 0.95rem; }
  .error-msg { background-color: #fff5f5; color: #c53030; border: 1px solid #feb2b2; }

  /* --- PERFIL --- */
  .profile-section { width: 100%; max-width: 1250px; animation: fadeIn 0.4s ease; z-index: 1; }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

  .profile-card {
    background: white; border-radius: 8px; overflow: hidden;
    border: 1px solid #e1e4e8; margin-bottom: 25px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  }
  .profile-header {
    background: #1a3c6d; color: white; padding: 20px 30px;
    display: flex; justify-content: space-between; align-items: center;
  }
  .profile-header h2 { margin: 0; font-size: 1.8rem; font-weight: 800; letter-spacing: 0.5px; }
  .badge-spc { background: rgba(255,255,255,0.2); padding: 5px 12px; border-radius: 20px; font-size: 0.8rem; font-weight: 600; letter-spacing: 1px; }
  
  .profile-stats-grid {
    display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    padding: 25px 30px; gap: 25px;
  }
  .stat-box { display: flex; flex-direction: column; }
  .stat-label { font-size: 0.75rem; color: #8898aa; text-transform: uppercase; font-weight: 700; margin-bottom: 6px; }
  .stat-value { font-size: 1.1rem; color: #32325d; font-weight: 600; }

  /* --- TABLA CARRERAS --- */
  .table-responsive {
    width: 100%; overflow-x: auto; border-radius: 8px;
    border: 1px solid #e1e4e8; background: white;
  }
  .racing-table { width: 100%; border-collapse: collapse; font-size: 0.9rem; white-space: nowrap; }
  
  /* Encabezados alineados a la izquierda por defecto */
  .racing-table th {
    background-color: #f6f9fc; color: #6b7c93; font-weight: 700;
    text-transform: uppercase; font-size: 0.75rem; padding: 12px 15px;
    text-align: left; border-bottom: 1px solid #e1e4e8;
  }
  .racing-table td {
    padding: 10px 15px; border-bottom: 1px solid #f0f0f0;
    color: #525f7f; vertical-align: middle; text-align: left; /* Por defecto izquierda */
  }
  .racing-table tr:hover { background-color: #fcfcfc; }

  /* CELDAS PERSONALIZADAS */
  .pos-badge {
    display: flex; justify-content: center; align-items: center;
    width: 28px; height: 28px; border-radius: 50%;
    background: #e9ecef; color: #555; font-weight: 700; font-size: 0.85rem; margin: 0 auto;
  }
  .pos-badge.winner { background: #ffd600; color: #000; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
  .pos-badge.nc { background: #ffecb3; color: #d32f2f; font-size: 0.7rem; }
  
  /* Anchos optimizados */
  .cell-premio { max-width: 180px; white-space: normal; line-height: 1.2; font-weight: 500; min-width: 150px; }
  .cell-dist { font-family: monospace; font-weight: 600; text-align: center !important; width: 60px; }
  .cell-time { font-family: monospace; color: #333; text-align: center !important; width: 80px; }
  .cell-cuerpos { text-align: right !important; font-weight: 700; color: #333; min-width: 80px; }
  
  /* JOCKEY ROJO ABAJO Y ALINEADO A LA IZQUIERDA */
  .jockey-cell { 
    display: flex; 
    flex-direction: column; 
    line-height: 1.2; 
    align-items: flex-start; /* Fuerza alineación izquierda */
    width: 100%;
  }
  .jockey-name { font-weight: 500; color: #333; }
  .jockey-weight { 
    font-size: 0.75rem; 
    color: #dc3545; /* Rojo */
    font-weight: 700; 
    margin-top: 2px; 
  }

  /* OBSERVACION ANCHA */
  .cell-obs { 
    font-style: italic; 
    font-size: 0.85rem; 
    color: #666; 
    min-width: 200px; 
    white-space: normal; 
  }

  @media (max-width: 768px) {
    .app-container { padding: 20px 10px; }
    .title-primary { font-size: 1.5rem; }
    .search-input-group { flex-direction: column; }
    .btn-search { width: 100%; padding: 15px; }
  }
`;

// --- FUNCIÓN HELPER: Formatear Cuerpos (Idioma Burrero) ---
const formatCuerpos = (valor) => {
  if (!valor || valor === '0' || valor === '-') return '-';
  if (isNaN(valor)) return valor;

  const num = parseFloat(valor);
  if (num === 0) return '-';

  const entero = Math.floor(num);
  const decimal = num - entero;
  
  let fraccion = '';
  if (decimal > 0.20 && decimal < 0.30) fraccion = '¼';
  else if (decimal > 0.45 && decimal < 0.55) fraccion = '½';
  else if (decimal > 0.70 && decimal < 0.80) fraccion = '¾';

  if (entero > 0 && fraccion) return `${entero} ${fraccion} cp`;
  if (entero > 0) return `${entero} cp`;
  if (fraccion) return `${fraccion} cp`;
  
  return valor;
};

function BuscadorCampana() {
  const [activeTab, setActiveTab] = useState('ejemplares');
  const [searchTerm, setSearchTerm] = useState("");
  const [sugerencias, setSugerencias] = useState([]);
  const [mostrarSugerencias, setMostrarSugerencias] = useState(false);
  const [caballoData, setCaballoData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (activeTab !== 'ejemplares') { setSugerencias([]); return; }

    const delayDebounceFn = setTimeout(async () => {
      if (searchTerm.length >= 3 && mostrarSugerencias) {
        try {
          const res = await fetch(`http://localhost:4000/api/sugerencias?term=${searchTerm}`);
          if (res.ok) {
            const data = await res.json();
            setSugerencias(data);
          }
        } catch (err) { console.error(err); }
      } else {
        if(searchTerm.length < 3) setSugerencias([]);
      }
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, activeTab, mostrarSugerencias]);

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
    setMostrarSugerencias(true);
  };

  const handleSearch = async (termino = searchTerm) => {
    if (!termino.trim()) return;
    setMostrarSugerencias(false);
    setSugerencias([]);

    if (activeTab !== 'ejemplares') {
      setError("🔜 La búsqueda de Profesionales y Caballerizas estará disponible próximamente.");
      setCaballoData(null);
      return;
    }
    
    setLoading(true);
    setError(null);
    setCaballoData(null);

    try {
      const response = await fetch(`http://localhost:4000/api/buscar?caballo=${termino}`);
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error === 'Caballo no encontrado' ? 'No se encontraron resultados.' : errData.error);
      }
      const data = await response.json();
      setCaballoData(data);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSugerencia = (nombre) => {
    setSearchTerm(nombre);
    setMostrarSugerencias(false); 
    setSugerencias([]);
    handleSearch(nombre);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year.slice(-2)}`;
  };

  let headerColor = '#1a3c6d';
  if (caballoData && caballoData.type === 'exact' && caballoData.perfil) {
    const p = caballoData.perfil;
    const esHembra = (p.sexo && p.sexo.toUpperCase() === 'HEMBRA') || (p.pelo && p.pelo.trim().toLowerCase().endsWith('A'));
    if (esHembra) headerColor = '#d63384'; 
  }

  return (
    <div className="app-container">
      <style>{styles}</style>

      <header className="main-header">
        <h1 className="title-primary">BUSCADOR ESTADÍSTICO</h1>
      </header>

      <div className="search-card">
        
        <div className="search-tabs">
          <div 
            className={`search-tab ${activeTab === 'ejemplares' ? 'active' : ''}`}
            onClick={() => { setActiveTab('ejemplares'); setSearchTerm(''); setError(null); setCaballoData(null); }}
          >
            🐎 Ejemplares SPC
          </div>
          <div 
            className={`search-tab ${activeTab === 'profesionales' ? 'active' : ''}`}
            onClick={() => { setActiveTab('profesionales'); setSearchTerm(''); setError(null); setCaballoData(null); }}
          >
            🏇 Profesionales
          </div>
          <div 
            className={`search-tab ${activeTab === 'caballerizas' ? 'active' : ''}`}
            onClick={() => { setActiveTab('caballerizas'); setSearchTerm(''); setError(null); setCaballoData(null); }}
          >
            🏠 Caballerizas
          </div>
        </div>

        <div className="search-body">
          <div className="search-input-group">
            <div className="search-input-wrapper">
              <input 
                className="main-input"
                type="text"
                value={searchTerm}
                onChange={handleInputChange} 
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder={
                  activeTab === 'ejemplares' ? "Ingrese nombre del caballo..." :
                  activeTab === 'profesionales' ? "Ingrese nombre del Jockey o Cuidador..." :
                  "Ingrese nombre de la Caballeriza..."
                }
                disabled={loading}
                autoComplete="off"
              />
              
              {mostrarSugerencias && sugerencias.length > 0 && (
                <ul className="suggestions-dropdown">
                  {sugerencias.map((sug, index) => (
                    <li 
                      key={index} 
                      className="suggestion-item"
                      onClick={() => handleSelectSugerencia(sug)}
                    >
                      {sug}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <button className="btn-search" onClick={() => handleSearch()} disabled={loading}>
              {loading ? '...' : 'BUSCAR'}
            </button>
          </div>

          {error && <div className="status-msg error-msg">{error}</div>}
          
          {/* RESULTADOS MÚLTIPLES (BOTONES LINDOS RESTAURADOS) */}
          {caballoData && caballoData.type === 'multiple' && (
            <div className="multiple-results">
              <div className="multiple-header">¿Buscabas alguno de estos?</div>
              <ul className="multiple-list">
                {caballoData.resultados.map((c) => (
                  <li key={c.id_caballo} className="multiple-item" onClick={() => handleSelectSugerencia(c.nombre)}>
                    {c.nombre}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {caballoData && caballoData.type === 'exact' && (
        <div className="profile-section">
          
          <div className="profile-card">
            <div className="profile-header" style={{ backgroundColor: headerColor }}>
              <h2>{caballoData.perfil.nombre}</h2>
              <span className="badge-spc">SPC</span>
            </div>

            <div className="profile-stats-grid">
              <div className="stat-box"><span className="stat-label">Edad</span><span className="stat-value">{caballoData.perfil.edad_actual} años</span></div>
              <div className="stat-box"><span className="stat-label">Pelaje</span><span className="stat-value">{caballoData.perfil.pelo || '-'}</span></div>
              <div className="stat-box"><span className="stat-label">Sexo</span><span className="stat-value">{caballoData.perfil.sexo || '-'}</span></div>
              <div className="stat-box"><span className="stat-label">Padre</span><span className="stat-value">{caballoData.perfil.padre || '-'}</span></div>
              <div className="stat-box"><span className="stat-label">Madre</span><span className="stat-value">{caballoData.perfil.madre || '-'}</span></div>
              <div className="stat-box"><span className="stat-label">Cuidador Actual</span><span className="stat-value">{caballoData.perfil.cuidador_actual}</span></div>
              <div className="stat-box"><span className="stat-label">Stud Actual</span><span className="stat-value">{caballoData.perfil.caballeriza_actual}</span></div>
            </div>
          </div>

          <div className="table-responsive">
            <table className="racing-table">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th style={{textAlign: 'center'}}>Pos</th>
                  <th>Premio</th>
                  <th style={{textAlign: 'center'}}>Dist.</th>
                  <th style={{textAlign: 'center'}}>Pista</th>
                  <th style={{textAlign: 'center'}}>Tiempo</th>
                  <th style={{textAlign: 'left'}}>Jockey</th> {/* Forzamos align left */}
                  <th>Cuidador</th>
                  <th>Stud</th>
                  <th style={{textAlign: 'right'}}>Cuerpos</th>
                  <th>Obs.</th>
                </tr>
              </thead>
              <tbody>
                {caballoData.actuaciones.map((act) => (
                  <tr key={act.id_actuacion}>
                    <td>{formatDate(act.fecha)}</td>
                    <td>
                      <span className={`pos-badge ${act.puesto_final === '1' ? 'winner' : act.puesto_final === 'NC' ? 'nc' : ''}`}>
                        {act.puesto_final}
                      </span>
                    </td>
                    <td className="cell-premio">{act.premio}</td>
                    <td className="cell-dist">{act.distancia}</td>
                    <td style={{textAlign: 'center'}}>{act.pista}</td>
                    <td className="cell-time">{act.tiempo}</td>
                    <td>
                      <div className="jockey-cell">
                        <span className="jockey-name">{act.jockey || '-'}</span>
                        {act.peso && act.peso !== '-' && <span className="jockey-weight">({act.peso}kg)</span>}
                      </div>
                    </td>
                    <td>{act.cuidador || '-'}</td>
                    <td>{act.caballeriza || '-'}</td>
                    
                    <td className="cell-cuerpos">
                        {formatCuerpos(act.cuerpos)}
                    </td>
                    
                    <td className="cell-obs">{act.observacion}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default BuscadorCampana;