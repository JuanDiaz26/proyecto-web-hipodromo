import sqlite3
import pandas as pd

# Conectar a la base de datos
conn = sqlite3.connect("hipodromo_tucuman.db")

# Ejecutar consulta para ver TODAS las actuaciones de Teenek
query = """
SELECT 
    a.fecha,
    a.nro_carrera,
    a.premio,
    a.distancia,
    a.puesto_original,
    a.puesto_final,
    a.jockey,
    c.nombre as caballo
FROM Actuaciones a
JOIN Caballos c ON a.id_caballo = c.id_caballo
WHERE UPPER(c.nombre) LIKE '%TEENEK%'
ORDER BY a.fecha DESC;
"""

df = pd.read_sql_query(query, conn)
print("=== TODAS LAS CARRERAS DE TEENEK EN LA BD ===")
print(df.to_string())
print(f"\nTotal de carreras encontradas: {len(df)}")

# Ver también qué archivos podrían estar causando el problema
print("\n=== FECHAS DONDE APARECE TEENEK ===")
for fecha in df['fecha'].unique():
    print(f"- {fecha}")

conn.close()