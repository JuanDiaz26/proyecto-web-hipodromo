// Archivo: src/components/BuscadorCampana.jsx
import React, { useState } from 'react';

// --- Estilos CSS (Puedes mover esto a tu archivo CSS principal si prefieres) ---
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
  }

  /* --- Ficha SPC --- */
  .ficha-spc {
    background: white;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    margin-top: 20px;
    overflow: hidden;
  }
  .ficha-header {
    background-color: #004a99;
    color: white;
    padding: 15px 20px;
    font-size: 1.5rem;
    font-weight: bold;
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
    font-size: 0.8rem;
    color: #555;
    text-transform: uppercase;
  }
  .ficha-item span {
    font-size: 1.1rem;
    color: #000;
  }

  /* --- Tabla de Actuaciones --- */
  .tabla-actuaciones {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
    background: white;
    font-size: 0.9rem;
  }
  .tabla-actuaciones th, .tabla-actuaciones td {
    padding: 10px 12px;
    text-align: left;
    border-bottom: 1px solid #ddd;
  }
  .tabla-actuaciones th {
    background-color: #f9f9f9;
    font-weight: bold;
    color: #333;
  }
  .tabla-actuaciones tr:hover {
    background-color: #f1f1f1;
  }
  .tabla-actuaciones .puesto {
    font-weight: bold;
    font-size: 1rem;
    text-align: center;
  }
  .tabla-actuaciones .obs-distanciado {
    color: #D8000C;
    font-weight: bold;
  }
  .tabla-actuaciones .obs-incidente {
    color: #E65100;
    font-weight: bold;
  }
`;

// --- El Componente React ---
function BuscadorCampana() {
  const [searchTerm, setSearchTerm] = useState("");
  const [caballoData, setCaballoData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    setCaballoData(null);

    try {
      // ¡Asegúrate de que la URL de tu API sea correcta!
      const response = await fetch(`http://localhost:4000/api/buscar?caballo=${searchTerm}`);
      
      if (!response.ok) {
        const errData = await response.json();
        // Usamos el mensaje de error de tu lógica
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
  
  // Función para formatear la fecha de 'YYYY-MM-DD' a 'DD/MM/YYYY'
  const formatDate = (dateString) => {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

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
            placeholder="Buscar campaña por nombre..."
          />
          <button onClick={handleSearch} disabled={loading}>
            {loading ? 'Buscando...' : 'Buscar'}
          </button>
        </div>

        {/* --- Mensajes --- */}
        {error && <div className="error-msg">{error}</div>}

        {/* --- Resultados --- */}
        {caballoData && (
          <div>
            {/* --- Ficha SPC --- */}
            <div className="ficha-spc">
              <div className="ficha-header">
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
                    <td className="puesto">{act.puesto_final || '-'}</td>
                    <td>{act.premio}</td>
                    <td>{act.jockey || 'S/D'}</td>
                    <td>{act.distancia} mts</td>
                    <td>{act.cuidador || 'S/D'}</td>
                    <td>{act.caballeriza || 'S/D'}</td>
                    <td>
                      {/* Lógica para mostrar observaciones especiales */}
                      {act.observacion && act.puesto_final === '*' && (
                        <span className="obs-incidente">{act.observacion}</span>
                      )}
                      {act.observacion && act.puesto_original !== parseInt(act.puesto_final, 10) && (
                        <span className="obs-distanciado">{act.observacion}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

          </div>
        )}
      </div>
    </>
  );
}

export default BuscadorCampana;