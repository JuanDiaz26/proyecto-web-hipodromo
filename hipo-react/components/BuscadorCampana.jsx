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
    /* El color de fondo se define dinámicamente en el componente */
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
  .ficha-item {
    line-height: 1.4;
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
    overflow-x: auto; /* Para que no rompa en movil */
  }
  .tabla-actuaciones {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
    background: white;
    font-size: 0.95rem;
  }
  .tabla-actuaciones th, .tabla-actuaciones td {
    padding: 12px 15px;
    text-align: left;
    border-bottom: 1px solid #ddd;
  }
  .tabla-actuaciones th {
    background-color: #f1f3f5;
    font-weight: bold;
    color: #495057;
    text-transform: uppercase;
    font-size: 0.85rem;
  }
  .tabla-actuaciones tr:hover {
    background-color: #f8f9fa;
  }
  .tabla-actuaciones .puesto {
    font-weight: bold;
    font-size: 1.1rem;
    text-align: center;
    color: #007bff;
  }
  .tabla-actuaciones .obs-distanciado {
    color: #D8000C;
    font-weight: bold;
    display: block;
    font-size: 0.85rem;
  }
  .tabla-actuaciones .obs-incidente {
    color: #E65100;
    font-weight: bold;
    display: block;
    font-size: 0.85rem;
  }
`;

// --- El Componente React ---
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
      // Asegúrate de que el puerto 4000 coincida con tu backend
      const response = await fetch(`http://localhost:4000/api/buscar?caballo=${searchTerm}`);
      
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error === 'Caballo no encontrado' ? 'El nombre del caballo es incorrecto o no se encontró' : errData.error);
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
  
  // Función para formatear la fecha
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  // --- LÓGICA DE COLOR (ROSA/AZUL) ---
  let headerColor = '#004a99'; // Azul por defecto (Macho)
  if (caballoData && caballoData.perfil) {
    const p = caballoData.perfil;
    // Es hembra si dice "HEMBRA" o si el pelaje termina en "A" (ej: Zaina, Alazana)
    const esHembra = (p.sexo && p.sexo.toUpperCase() === 'HEMBRA') || 
                     (p.pelo && p.pelo.trim().toLowerCase().endsWith('a'));
    
    if (esHembra) {
      headerColor = '#e83e8c'; // Rosa fuerte
    }
  }

  return (
    <>
      <style>{styles}</style>
      
      <div className="buscador-container">
        {/* --- Barra de Búsqueda --- */}
        <div className="buscador-header">
          <input 
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Buscar campaña por nombre (ej: Suffok)..."
            disabled={loading}
          />
          <button onClick={handleSearch} disabled={loading}>
            {loading ? 'Buscando...' : 'Buscar'}
          </button>
        </div>

        {/* --- Mensajes --- */}
        {error && <div className="error-msg">⚠️ {error}</div>}

        {/* --- Resultados --- */}
        {caballoData && (
          <div>
            {/* --- Ficha SPC --- */}
            <div className="ficha-spc">
              <div 
                className="ficha-header" 
                style={{ backgroundColor: headerColor }} /* AQUI SE APLICA EL COLOR */
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
                  <span>{caballoData.perfil.pelo || 'S/D'}</span>
                </div>
                <div className="ficha-item">
                  <strong>Sexo</strong>
                  <span>{caballoData.perfil.sexo || 'S/D'}</span>
                </div>
                <div className="ficha-item">
                  <strong>Padre</strong>
                  <span>{caballoData.perfil.padre || 'S/D'}</span>
                </div>
                <div className="ficha-item">
                  <strong>Madre</strong>
                  <span>{caballoData.perfil.madre || 'S/D'}</span>
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

            {/* --- Tabla de Actuaciones --- */}
            <div className="tabla-container">
              <table className="tabla-actuaciones">
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th className="puesto">Puesto</th>
                    <th>Premio</th>
                    <th>Jockey</th>
                    <th>Dist.</th>
                    <th>Cuidador</th>
                    <th>Caballeriza</th>
                    <th>Observación</th>
                  </tr>
                </thead>
                <tbody>
                  {caballoData.actuaciones.map((act) => (
                    <tr key={act.id_actuacion}>
                      <td>{formatDate(act.fecha)}</td>
                      <td className="puesto">{act.puesto_final}</td>
                      <td>{act.premio}</td>
                      <td>{act.jockey || 'S/D'}</td>
                      {/* Quitamos " mts" porque el backend ya lo envía */}
                      <td>{act.distancia}</td>
                      <td>{act.cuidador || 'S/D'}</td>
                      <td>{act.caballeriza || 'S/D'}</td>
                      <td>
                        {act.observacion}
                        {/* Lógica extra para resaltar errores si es necesario */}
                        {act.puesto_final === 'NC' && act.observacion && (
                          <span className="obs-incidente"></span>
                        )}
                      </td>
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