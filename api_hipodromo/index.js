const express = require("express");
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
const cors = require("cors");

const app = express();
const PORT = 4000;
const DATABASE_FILE = "hipodromo_tucuman.db";

app.use(cors());
app.use(express.json());

let db;

function calcularEdadActual(anoNacimiento) {
  if (!anoNacimiento) return null;
  const hoy = new Date();
  const y = hoy.getFullYear();
  const mes = hoy.getMonth() + 1;
  let edad = y - Number(anoNacimiento);
  if (mes < 7) { edad -= 1; }
  return edad > 0 ? edad : 0; 
}

// Endpoint de Autocompletado (La lista flotante)
app.get("/api/sugerencias", async (req, res) => {
  const term = req.query.term;
  if (!term || term.length < 3) return res.json([]);
  try {
    const sugerencias = await db.all(
      `SELECT nombre FROM Caballos WHERE nombre LIKE ? ORDER BY nombre ASC LIMIT 10`,
      [`${term.toUpperCase()}%`]
    );
    res.json(sugerencias.map(s => s.nombre));
  } catch (err) {
    res.json([]);
  }
});

// Endpoint de Búsqueda Principal (Mejorado)
app.get("/api/buscar", async (req, res) => {
  const nombreCaballo = req.query.caballo;
  if (!nombreCaballo) {
    return res.status(400).json({ error: "Falta el nombre del caballo" });
  }

  const nombreOriginal = nombreCaballo.toUpperCase().trim();
  const nombreSinSimbolos = nombreOriginal.replace(/['"´`]/g, "");

  console.log(`Buscando: "${nombreOriginal}"`);

  try {
    // 1. INTENTO EXACTO
    let perfil = await db.get(
      `SELECT * FROM Caballos 
       WHERE REPLACE(UPPER(nombre), "'", "") = ? 
       OR UPPER(nombre) = ?`, 
      [nombreSinSimbolos, nombreOriginal]
    );

    // 2. SI NO ES EXACTO -> BUSCAR PARECIDOS (Lista de Selección)
    if (!perfil) {
      const candidatos = await db.all(
        `SELECT * FROM Caballos 
         WHERE nombre LIKE ? 
         ORDER BY nombre ASC LIMIT 20`,
        [`${nombreOriginal}%`] // Busca los que empiezan con...
      );

      if (candidatos.length > 0) {
        // Devolvemos tipo "multiple" para que el frontend sepa que mostrar lista
        return res.json({ 
          type: 'multiple', 
          resultados: candidatos 
        });
      } else {
        return res.status(404).json({ error: "Caballo no encontrado" });
      }
    }

    // 3. SI ES EXACTO -> TRAER DATOS COMPLETOS
    const edad_actual = calcularEdadActual(perfil.ano_nacimiento);

    const actuacionesRaw = await db.all(
      `SELECT * FROM Actuaciones 
       WHERE id_caballo = ?
       AND (distancia IS NULL OR distancia > 600)
       ORDER BY date(fecha) DESC, CAST(COALESCE(nro_carrera,0) AS INTEGER) ASC`,
      [perfil.id_caballo]
    );

    const actuaciones = actuacionesRaw.map((a) => {
      let puesto = a.puesto_final;
      if (puesto === "*" || puesto === "NC") puesto = "NC";
      if (!puesto) puesto = a.puesto_original || "-";
      const distStr = a.distancia ? `${a.distancia}` : "-";
      const tiempoStr = a.tiempo_carrera ? a.tiempo_carrera : "-";
      const pistaStr = a.estado_pista ? a.estado_pista : "-";
      const cuerposStr = a.cuerpos_acumulados ? a.cuerpos_acumulados : (a.cuerpos || "");

      return {
        ...a,
        puesto_final: puesto,
        premio: a.premio || "Premio sin nombre",
        distancia: distStr,
        tiempo: tiempoStr,
        pista: pistaStr, 
        peso: a.peso || "-",
        cuerpos: cuerposStr, 
        observacion: a.observacion || ""
      };
    });

    const ultimos = await db.get(
      `SELECT cuidador, caballeriza FROM Actuaciones 
       WHERE id_caballo = ? AND cuidador IS NOT NULL AND cuidador != '' AND cuidador != 'S/D'
       ORDER BY date(fecha) DESC LIMIT 1`,
      [perfil.id_caballo]
    );

    res.json({
      type: 'exact', // Marca que es un resultado único
      perfil: {
        ...perfil,
        edad_actual: edad_actual,
        edad_label: edad_actual ? `${edad_actual} años` : "S/D",
        cuidador_actual: ultimos?.cuidador || "S/D",
        caballeriza_actual: ultimos?.caballeriza || "S/D",
      },
      actuaciones
    });

  } catch (err) {
    console.error("Error en DB:", err.message);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

(async () => {
  try {
    db = await open({
      filename: DATABASE_FILE,
      driver: sqlite3.Database,
      mode: sqlite3.OPEN_READONLY 
    });
    console.log("✅ API OK puerto 4000");
    app.listen(PORT);
  } catch (err) { console.error("❌ Error DB", err); }
})();