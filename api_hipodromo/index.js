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

app.get("/api/buscar", async (req, res) => {
  const nombreCaballo = req.query.caballo;
  if (!nombreCaballo) {
    return res.status(400).json({ error: "Falta el nombre del caballo" });
  }

  const nombreLimpio = nombreCaballo.toUpperCase().trim();
  console.log(`Buscando campaña de: ${nombreLimpio}`);

  try {
    const perfil = await db.get(`SELECT * FROM Caballos WHERE nombre = ?`, [nombreLimpio]);

    if (!perfil) {
      return res.status(404).json({ error: "Caballo no encontrado" });
    }

    const edad_actual = calcularEdadActual(perfil.ano_nacimiento);

    const actuacionesRaw = await db.all(
      `SELECT * FROM Actuaciones WHERE id_caballo = ?
       ORDER BY date(fecha) DESC, CAST(COALESCE(nro_carrera,0) AS INTEGER) ASC`,
      [perfil.id_caballo]
    );

    const actuaciones = actuacionesRaw.map((a) => {
      let puesto = a.puesto_final;
      if (puesto === "*" || puesto === "NC") puesto = "NC";
      if (!puesto) puesto = a.puesto_original || "-";

      // V57: SOLO NUMERO EN DISTANCIA
      const distStr = a.distancia ? `${a.distancia}` : "-";
      
      const tiempoStr = a.tiempo_carrera ? a.tiempo_carrera : "-";

      return {
        ...a,
        puesto_final: puesto,
        premio: a.premio || "Premio sin nombre",
        distancia: distStr,
        tiempo: tiempoStr,
        peso: a.peso || "-",
        observacion: a.observacion || ""
      };
    });

    const ultimos = await db.get(
      `SELECT cuidador, caballeriza 
       FROM Actuaciones 
       WHERE id_caballo = ? 
       AND cuidador IS NOT NULL AND cuidador != '' AND cuidador != 'S/D'
       ORDER BY date(fecha) DESC LIMIT 1`,
      [perfil.id_caballo]
    );

    const respuesta = {
      perfil: {
        ...perfil,
        edad_actual: edad_actual,
        edad_label: edad_actual ? `${edad_actual} años` : "S/D",
        cuidador_actual: ultimos?.cuidador || "S/D",
        caballeriza_actual: ultimos?.caballeriza || "S/D",
      },
      actuaciones
    };

    res.json(respuesta);

  } catch (err) {
    console.error("Error en DB:", err.message);
    res.status(500).json({ error: "Error interno" });
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