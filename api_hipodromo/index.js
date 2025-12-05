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

// Utilidad: Calcular edad hípica (Cumpleaños el 1 de Julio)
function calcularEdadActual(anoNacimiento) {
  if (!anoNacimiento) return null;
  const hoy = new Date();
  const y = hoy.getFullYear();
  const mes = hoy.getMonth() + 1; // Enero = 1, Julio = 7
  
  let edad = y - Number(anoNacimiento);
  
  // Si estamos antes del 1 de julio, restamos 1 año
  if (mes < 7) {
    edad -= 1;
  }
  
  return edad > 0 ? edad : 0; 
}

// ---------- Endpoint ----------
app.get("/api/buscar", async (req, res) => {
  const nombreCaballo = req.query.caballo;
  if (!nombreCaballo) {
    return res.status(400).json({ error: "Falta el nombre del caballo" });
  }

  // 1. Preparamos el nombre para la búsqueda "inteligente"
  // nombreOriginal: Tal cual lo escribió el usuario (en mayúsculas)
  const nombreOriginal = nombreCaballo.toUpperCase().trim();
  // nombreSinSimbolos: Le quitamos comillas simples, dobles y acentos (ej: HE'S -> HES)
  const nombreSinSimbolos = nombreOriginal.replace(/['"´`]/g, "");

  console.log(`Buscando: "${nombreOriginal}" (Limpio: "${nombreSinSimbolos}")`);

  try {
    // 2. Buscar Perfil (Con truco de SQL para ignorar el apóstrofe)
    // La consulta dice: "Dame el caballo cuyo nombre (sin comillas) sea igual a mi búsqueda (sin comillas)"
    // O "Dame el caballo cuyo nombre sea exactamente igual a lo que escribí"
    const perfil = await db.get(
      `SELECT * FROM Caballos 
       WHERE REPLACE(UPPER(nombre), "'", "") = ? 
       OR UPPER(nombre) = ?`, 
      [nombreSinSimbolos, nombreOriginal]
    );

    if (!perfil) {
      return res.status(404).json({ error: "Caballo no encontrado" });
    }

    const edad_actual = calcularEdadActual(perfil.ano_nacimiento);

    // 3. Buscar Actuaciones CON FILTRO DE DISTANCIA (> 600 mts)
    // Esto elimina las carreras concertadas (cuadreras) de la vista
    const actuacionesRaw = await db.all(
      `SELECT *
       FROM Actuaciones
       WHERE id_caballo = ?
       AND (distancia IS NULL OR distancia > 600) -- Filtro Anti-Concertadas
       ORDER BY date(fecha) DESC, CAST(COALESCE(nro_carrera,0) AS INTEGER) ASC`,
      [perfil.id_caballo]
    );

    // 4. Normalizar datos para el Frontend
    const actuaciones = actuacionesRaw.map((a) => {
      let puesto = a.puesto_final;
      if (puesto === "*" || puesto === "NC") puesto = "NC";
      if (!puesto) puesto = a.puesto_original || "-";

      // Distancia: solo el número
      const distStr = a.distancia ? `${a.distancia}` : "-";
      
      // Tiempo
      const tiempoStr = a.tiempo_carrera ? a.tiempo_carrera : "-";

      // Estado de Pista
      const pistaStr = a.estado_pista ? a.estado_pista : "-";

      return {
        ...a,
        puesto_final: puesto,
        premio: a.premio || "Premio sin nombre",
        distancia: distStr,
        tiempo: tiempoStr,
        pista: pistaStr, 
        peso: a.peso || "-",
        observacion: a.observacion || ""
      };
    });

    // 5. Buscar Últimos Datos (Cuidador/Stud)
    const ultimos = await db.get(
      `SELECT cuidador, caballeriza 
       FROM Actuaciones 
       WHERE id_caballo = ? 
       AND cuidador IS NOT NULL AND cuidador != '' AND cuidador != 'S/D'
       ORDER BY date(fecha) DESC LIMIT 1`,
      [perfil.id_caballo]
    );

    // 6. Armar respuesta final
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
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// ---------- Inicialización ----------
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