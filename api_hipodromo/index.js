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

// util edad con “cumple” 1 de julio (Argentina/hipódromo)
function calcularEdadActual(anoNacimiento) {
  if (!anoNacimiento) return null;
  const hoy = new Date();
  const y = hoy.getFullYear();
  const mes = hoy.getMonth() + 1; // 1..12
  let edad = y - Number(anoNacimiento);
  // Si aún no pasó el 1 de julio, restar 1
  if (mes < 7) edad -= 1;
  return edad;
}

// ---------- Endpoint ----------
app.get("/api/buscar", async (req, res) => {
  const nombreCaballo = req.query.caballo;
  if (!nombreCaballo) {
    return res.status(400).json({ error: "Falta el nombre del caballo" });
  }

  const nombreLimpio = nombreCaballo.toUpperCase().trim();
  console.log(`Buscando campaña de: ${nombreLimpio}`);

  try {
    // Perfil + edad calculada en Node (robusto para el front)
    const perfil = await db.get(
      `SELECT * FROM Caballos WHERE nombre = ?`,
      [nombreLimpio]
    );

    if (!perfil) {
      return res.status(404).json({ error: "Caballo no encontrado" });
    }

    const edad_actual = calcularEdadActual(perfil.ano_nacimiento);

    // Todas las actuaciones, ordenadas por fecha DESC + nro_carrera ASC
    const actuacionesRaw = await db.all(
      `SELECT *
       FROM Actuaciones
       WHERE id_caballo = ?
       ORDER BY date(fecha) DESC, CAST(COALESCE(nro_carrera,0) AS INTEGER) ASC`,
      [perfil.id_caballo]
    );

    // Normalizaciones para el front
    const actuaciones = actuacionesRaw.map((a) => {
      const puesto = (a.puesto_final === "*" ? "NC" : a.puesto_final) || a.puesto_original || "-";
      const premioNombre = a.premio || "Premio sin nombre";
      const distStr = a.distancia ? `${a.distancia} mts` : "";
      let obs = a.observacion || "";
      // Caso típico: si observación contiene “distanciado” y no trae puesto_final, lo dejamos textual
      return {
        ...a,
        puesto_final: puesto,
        premio: premioNombre,
        distancia: distStr,
        observacion: obs
      };
    });

    // último cuidador/caballeriza desde actuaciones reales
    const ultimos = await db.get(
      `SELECT cuidador, caballeriza 
       FROM Actuaciones 
       WHERE id_caballo = ? AND (cuidador IS NOT NULL OR caballeriza IS NOT NULL)
       ORDER BY date(fecha) DESC LIMIT 1`,
      [perfil.id_caballo]
    );

    const respuesta = {
      perfil: {
        ...perfil,
        edad_actual: edad_actual,                // número (p.ej. 5)
        edad_label: edad_actual ? `${edad_actual} años` : "años",
        cuidador_actual: ultimos?.cuidador || "S/D",
        caballeriza_actual: ultimos?.caballeriza || "S/D",
      },
      actuaciones
    };

    res.json(respuesta);
  } catch (err) {
    console.error("Error en la base de datos:", err.message);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// ---------- Boot ----------
(async () => {
  try {
    db = await open({
      filename: DATABASE_FILE,
      driver: sqlite3.Database,
      mode: sqlite3.OPEN_READONLY
    });
    console.log("Conectado exitosamente a la base de datos.");
    app.listen(PORT, () => {
      console.log(`🚀 Servidor API corriendo en http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Error al conectar con la base de datos:", err.message);
  }
})();
