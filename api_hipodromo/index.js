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
  
  return edad > 0 ? edad : 0; // Evitar edades negativas
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
    // 1. Buscar Perfil del Caballo
    const perfil = await db.get(
      `SELECT * FROM Caballos WHERE nombre = ?`,
      [nombreLimpio]
    );

    if (!perfil) {
      return res.status(404).json({ error: "Caballo no encontrado" });
    }

    // Calcular edad actual en el momento de la consulta
    const edad_actual = calcularEdadActual(perfil.ano_nacimiento);

    // 2. Buscar Actuaciones (Ordenadas por Fecha descendente)
    const actuacionesRaw = await db.all(
      `SELECT *
       FROM Actuaciones
       WHERE id_caballo = ?
       ORDER BY date(fecha) DESC, CAST(COALESCE(nro_carrera,0) AS INTEGER) ASC`,
      [perfil.id_caballo]
    );

    // 3. Normalizar datos para el Frontend
    const actuaciones = actuacionesRaw.map((a) => {
      // Manejo de Puesto: Si es "*", mostramos "NC", sino el valor que venga
      let puesto = a.puesto_final;
      if (puesto === "*") puesto = "NC";
      if (!puesto) puesto = a.puesto_original || "-";

      const premioNombre = a.premio || "Premio sin nombre";
      
      // Aquí agregamos " mts" porque en la DB ahora guardamos solo el número (ej: 1200)
      const distStr = a.distancia ? `${a.distancia} mts` : "";
      
      const obs = a.observacion || "";

      return {
        ...a,
        puesto_final: puesto,
        premio: premioNombre,
        distancia: distStr,
        observacion: obs
      };
    });

    // 4. Buscar 'Últimos Datos Conocidos' (Cuidador/Caballeriza)
    // Esto sirve para llenar la ficha de arriba si la última carrera no tiene datos
    const ultimos = await db.get(
      `SELECT cuidador, caballeriza 
       FROM Actuaciones 
       WHERE id_caballo = ? 
       AND cuidador IS NOT NULL 
       AND cuidador != '' 
       AND cuidador != 'S/D'
       AND caballeriza IS NOT NULL 
       AND caballeriza != '' 
       AND caballeriza != 'S/D'
       ORDER BY date(fecha) DESC LIMIT 1`,
      [perfil.id_caballo]
    );

    // 5. Armar respuesta final
    const respuesta = {
      perfil: {
        ...perfil,
        edad_actual: edad_actual,
        edad_label: edad_actual ? `${edad_actual} años` : "S/D",
        // Usamos el dato de la última actuación conocida, o "S/D" si nunca corrió con cuidador registrado
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

// ---------- Inicialización del Servidor ----------
(async () => {
  try {
    db = await open({
      filename: DATABASE_FILE,
      driver: sqlite3.Database,
      mode: sqlite3.OPEN_READONLY // Modo lectura para seguridad
    });
    console.log("Conectado exitosamente a la base de datos.");
    
    app.listen(PORT, () => {
      console.log(`🚀 Servidor API corriendo en http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Error al conectar con la base de datos:", err.message);
  }
})();