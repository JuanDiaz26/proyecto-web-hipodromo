// Archivo: src/components/BuscadorCampana.jsx
import React, { useState } from 'react';

// --- Estilos CSS ---
const styles = `
  .buscador-container {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    padding: 20px;
    max-width: 1200px;
    margin: 20px auto;
    background: #f4f7f6;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  }
  .buscador-header {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
  }
  .buscador-header input {
    flex-grow: 1;
    font-size: 1.1rem;
    padding: 12px 15px;
    border: 1px solid #ccc;
    border-radius: 6px;
  }
  .buscador-header button {
    font-size: 1.1rem;
    padding: 12px 20px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  .buscador-header button:hover {
    background-color: #0056b3;
  }
  .error-msg {
    color: #D8000C;
    background-color: #FFD2D2;
    padding: 10px;
    border-radius: 6px;
    margin-bottom: 20px;
  }

  /* --- Ficha SPC --- */
  .ficha-spc {
    background: white;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    margin-top: 20px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }
  .ficha-header {
    color: white;
    padding: 15px 20px;
    font-size: 1.8rem;
    font-weight: bold;
    text-transform: uppercase;
    text-shadow: 1px 1px 3px rgba(0,0,0,0.2);
  }
  .ficha-body {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 15px;
    padding: 20px;
  }
  .ficha-item strong {
    display: block;
    font-size: 0.85rem;
    color: #666;
    text-transform: uppercase;
    margin-bottom: 4px;
  }
  .ficha-item span {
    font-size: 1.1rem;
    color: #000;
    font-weight: 500;
  }

  /* --- Tabla de Actuaciones --- */
  .tabla-container {
    overflow-x: auto;
  }
  .tabla-actuaciones {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
    background: white;
    font-size: 0.90rem;
  }
  .tabla-actuaciones th, .tabla-actuaciones td {
    padding: 10px 12px;
    text-align: left;
    border-bottom: 1px solid #ddd;
    vertical-align: middle;
  }
  .tabla-actuaciones th {
    background-color: #f1f3f5;
    font-weight: bold;
    color: #495057;
    text-transform: uppercase;
    font-size: 0.80rem;
    letter-spacing: 0.5px;
  }
  .tabla-actuaciones tr:hover {
    background-color: #f8f9fa;
  }
  
  /* --- COLUMNAS PERSONALIZADAS --- */
  
  /* Fecha: Ancho fijo para que no baile */
  .col-fecha { 
    width: 90px; 
    white-space: nowrap;
  }
  
  /* Puesto: Centrado y finito */
  .col-puesto { 
    width: 40px; 
    text-align: center !important; 
    padding-left: 5px !important; 
    padding-right: 5px !important; 
  }
  
  /* PREMIO: El cambio clave para que baje la linea */
  .col-premio {
    max-width: 200px;       /* Ancho maximo antes de bajar */
    min-width: 140px;
    white-space: normal;    /* Permite saltos de linea */
    line-height: 1.2;       /* Lineas mas juntas */
    font-size: 0.85rem;     /* Letra un pelin mas chica */
  }

  /* Distancia y Tiempo: Centrados */
  .col-dist { 
    width: 60px; 
    text-align: center !important; 
  }
  .col-tiempo { 
    width: 70px; 
    text-align: center !important;
  }
  
  /* Estilos de datos */
  .puesto-badge {
    display: inline-block;
    width: 28px;
    height: 28px;
    line-height: 28px;
    border-radius: 50%;
    background: #e9ecef;
    color: #333;
    font-weight: bold;
    font-size: 0.95rem;
  }
  .puesto-badge.primero {
    background: #ffd700;
    color: #000;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
  
  /* Jockey con Peso abajo */
  .jockey-cell {
    display: flex;
    flex-direction: column;
    line-height: 1.1;
  }
  .peso-badge {
    font-size: 0.75rem;
    color: #dc3545;
    font-weight: bold;
    margin-top: 3px;
  }

  .obs-cell {
    font-size: 0.85rem;
    color: #555;
    font-style: italic;
    max-width: 200px; /* Tambien limitamos observacion por las dudas */
  }
`;

function BuscadorCampana() {
  const [searchTerm, setSearchTerm] = useState("");
  const [caballoData, setCaballoData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    setLoading(true);
    setError(null);
    setCaballoData(null);

    try {
      const response = await fetch(`http://localhost:4000/api/buscar?caballo=${searchTerm}`);
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error === 'Caballo no encontrado' ? 'No se encontró el caballo' : errData.error);
      }
      const data = await response.json();
      setCaballoData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year.slice(-2)}`;
  };

  // Lógica de color Rosa/Azul
  let headerColor = '#004a99'; 
  if (caballoData && caballoData.perfil) {
    const p = caballoData.perfil;
    const esHembra = (p.sexo && p.sexo.toUpperCase() === 'HEMBRA') || 
                     (p.pelo && p.pelo.trim().toLowerCase().endsWith('A'));
    if (esHembra) {
      headerColor = '#e83e8c'; 
    }
  }

  return (
    <>
      <style>{styles}</style>
      
      <div className="buscador-container">
        <div className="buscador-header">
          <input 
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Nombre del caballo..."
            disabled={loading}
          />
          <button onClick={handleSearch} disabled={loading}>
            {loading ? '...' : 'Buscar'}
          </button>
        </div>

        {error && <div className="error-msg">⚠️ {error}</div>}

        {caballoData && (
          <div>
            <div className="ficha-spc">
              <div 
                className="ficha-header" 
                style={{ backgroundColor: headerColor }}
              >
                {caballoData.perfil.nombre}
              </div>
              <div className="ficha-body">
                <div className="ficha-item">
                  <strong>Edad</strong>
                  <span>{caballoData.perfil.edad_actual} años</span>
                </div>
                <div className="ficha-item">
                  <strong>Pelaje</strong>
                  <span>{caballoData.perfil.pelo || '-'}</span>
                </div>
                <div className="ficha-item">
                  <strong>Sexo</strong>
                  <span>{caballoData.perfil.sexo || '-'}</span>
                </div>
                <div className="ficha-item">
                  <strong>Padre</strong>
                  <span>{caballoData.perfil.padre || '-'}</span>
                </div>
                <div className="ficha-item">
                  <strong>Madre</strong>
                  <span>{caballoData.perfil.madre || '-'}</span>
                </div>
                <div className="ficha-item">
                  <strong>Cuidador Actual</strong>
                  <span>{caballoData.perfil.cuidador_actual}</span>
                </div>
                <div className="ficha-item">
                  <strong>Caballeriza Actual</strong>
                  <span>{caballoData.perfil.caballeriza_actual}</span>
                </div>
              </div>
            </div>

            <div className="tabla-container">
              <table className="tabla-actuaciones">
                <thead>
                  <tr>
                    <th className="col-fecha">Fecha</th>
                    <th className="col-puesto">Pos</th>
                    <th className="col-premio">Premio</th> {/* CLASE NUEVA APLICADA */}
                    <th className="col-dist">Dist.</th>
                    <th className="col-tiempo">Tiempo</th>
                    <th>Jockey</th>
                    <th>Cuidador</th>
                    <th>Stud</th>
                    <th>Obs.</th>
                  </tr>
                </thead>
                <tbody>
                  {caballoData.actuaciones.map((act) => (
                    <tr key={act.id_actuacion}>
                      <td>{formatDate(act.fecha)}</td>
                      <td className="col-puesto">
                        <span className={`puesto-badge ${act.puesto_final === '1' ? 'primero' : ''}`}>
                          {act.puesto_final}
                        </span>
                      </td>
                      <td className="col-premio">{act.premio}</td> {/* CLASE NUEVA APLICADA */}
                      <td className="col-dist">{act.distancia}</td>
                      <td className="col-tiempo">{act.tiempo}</td>
                      <td>
                        <div className="jockey-cell">
                          <span>{act.jockey || '-'}</span>
                          {act.peso && act.peso !== '-' && (
                            <span className="peso-badge">({act.peso} kg)</span>
                          )}
                        </div>
                      </td>
                      <td>{act.cuidador || '-'}</td>
                      <td>{act.caballeriza || '-'}</td>
                      <td className="obs-cell">{act.observacion}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        )}
      </div>
    </>
  );
}

export default BuscadorCampana;