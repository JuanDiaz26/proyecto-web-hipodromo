import pandas as pd
import sqlite3
import os
import re
from datetime import datetime

# --- CONFIGURACIÓN ---
CARPETA_PROGRAMAS = "programas"
CARPETA_RESULTADOS = "resultados"
DATABASE_FILE = "hipodromo_tucuman.db"

MESES_ES = {
    'ENERO': 1, 'FEBRERO': 2, 'MARZO': 3, 'ABRIL': 4, 'MAYO': 5, 'JUNIO': 6,
    'JULIO': 7, 'AGOSTO': 8, 'SEPTIEMBRE': 9, 'OCTUBRE': 10, 'NOVIEMBRE': 11, 'DICIEMBRE': 12
}

# --- UTILIDADES ---

def norm_txt(s):
    if s is None: return ""
    s = str(s).upper().strip()
    # Limpieza básica de caracteres
    s = s.replace('Á','A').replace('É','E').replace('Í','I').replace('Ó','O').replace('Ú','U').replace('Ñ','N')
    s = re.sub(r'\s+', ' ', s)
    return s

def es_nombre_valido(texto):
    """
    V17: FILTRO ANTI-FANTASMA.
    Analiza si el texto es un nombre real o una línea de tabulada (ej: '2º a 3 cp de Teenek').
    """
    if not texto: return False
    t = norm_txt(texto)
    
    # 1. Longitud excesiva (un nombre de caballo no suele pasar de 25-30 letras)
    if len(t) > 30: return False 
    
    # 2. Rechazar si empieza con números (Ej: "24/09/25" o "2º ...")
    # Los nombres de caballos nunca empiezan con número.
    if t and t[0].isdigit(): return False

    # 3. Palabras prohibidas típicas de descripciones de carrera
    patrones_prohibidos = [
        r'\bCP\b',     # "3 CP"
        r'\bCPOS\b',   # "3 CPOS"
        r'\bAL\s+\d',  # "AL 3" (Al 3er puesto)
        r'\d{2}/\d{2}',# Fechas tipo 22/05
        r'\d\'',       # Tiempos tipo 1'22"
        r'\bDE\b.{3,}\bDE\b' # "de ... de"
    ]
    
    for pat in patrones_prohibidos:
        if re.search(pat, t): return False
    
    return True

def estandarizar_observacion(texto):
    """Limpia las observaciones largas."""
    if not texto: return None
    t = texto.upper()
    if any(x in t for x in ["RETIRADO", "ESCAP", "DISPAR", "NEGÓ", "PARTIDORES"]):
        return "Retirado de los partidores"
    if "ROD" in t: return "Rodó"
    if "DISTANCIADO" in t or "DIST." in t:
        m = re.search(r'AL\s*(\d+)', t)
        if m: return f"Distanciado al {m.group(1)}º"
        return "Distanciado"
    if "SUJETA" in t or "SOFREN" in t: return "Sofrenó"
    return texto.capitalize()

def limpiar_distancia(texto):
    if not texto: return None
    t = str(texto).replace('.', '')
    # Prioridad: "mts"
    m_expl = re.search(r'(?<!\d)(\d{3,4})\s*(?:mts|m|metros)\b', t, re.I)
    if m_expl: return int(m_expl.group(1))
    # Secundario: Numeros lógicos aislados
    numeros = re.findall(r'\b(\d{3,4})\b', t)
    validos = [int(n) for n in numeros if 400 <= int(n) <= 3000]
    if len(validos) == 1: return validos[0]
    return None

def limpiar_nro_carrera(texto):
    if not texto: return 1
    t = norm_txt(texto)
    m = re.search(r'\b(\d+)(?:°|º|ª|DA|RA|TA)?\s*CARRERA', t)
    if m: return int(m.group(1))
    if t.isdigit(): return int(t) # Soporte para celdas que solo tienen el número
    return 1

def extraer_estado_pista(texto):
    if not texto: return None
    t = norm_txt(texto)
    m_sigla = re.search(r'\bP\.?\s*([BNHPF])\.?(?:\s|$|-)', t)
    if m_sigla:
        letra = m_sigla.group(1)
        mapa = {'N':'NORMAL','B':'BARROSA','H':'HUMEDA','P':'PESADA','F':'FANGOSA'}
        return mapa.get(letra)
    if "BARROSA" in t: return "BARROSA"
    if "PESADA" in t: return "PESADA"
    if "HUMEDA" in t: return "HUMEDA"
    if "FANGOSA" in t: return "FANGOSA"
    if "NORMAL" in t: return "NORMAL"
    return None

def parsear_fecha_reunion(texto):
    if not texto or not isinstance(texto, str): return None
    texto = norm_txt(texto)
    m = re.search(r'(\d{1,2})\s+DE\s+([A-Z]+)\s+DE\s+(\d{2,4})', texto)
    if m:
        d, mes, y_str = int(m.group(1)), m.group(2), m.group(3)
        y = int(y_str)
        if y < 100: y += 2000
        if mes in MESES_ES: return datetime(y, MESES_ES[mes], d)
    m = re.search(r'(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})', texto)
    if m:
        d, M, y = int(m.group(1)), int(m.group(2)), int(m.group(3))
        if y < 100: y += 2000
        return datetime(y, M, d)
    return None

def derivar_sexo(pelo):
    if not pelo: return "Macho"
    p = norm_txt(pelo)
    if p.endswith('A') or "YEGUA" in p: return "Hembra"
    return "Macho"

# --- DB ---
def crear_base_de_datos():
    if os.path.exists(DATABASE_FILE):
        try: os.remove(DATABASE_FILE); print(">>> DB Vieja eliminada (V17).")
        except: pass
    conn = sqlite3.connect(DATABASE_FILE)
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS Caballos(
            id_caballo INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL UNIQUE,
            padre TEXT, madre TEXT, pelo TEXT, sexo TEXT, ano_nacimiento INTEGER
        )''')
    c.execute('''CREATE TABLE IF NOT EXISTS Actuaciones(
            id_actuacion INTEGER PRIMARY KEY AUTOINCREMENT,
            id_caballo INTEGER NOT NULL,
            fecha TEXT, nro_carrera INTEGER, premio TEXT, distancia INTEGER,
            puesto_original INTEGER, puesto_final TEXT, jockey TEXT, peso REAL,
            cuidador TEXT, caballeriza TEXT, dividendo REAL, tiempo_carrera TEXT,
            estado_pista TEXT, nro_mandil INTEGER, observacion TEXT,
            FOREIGN KEY(id_caballo) REFERENCES Caballos(id_caballo),
            UNIQUE(id_caballo, fecha, nro_carrera) 
        )''')
    conn.commit()
    conn.close()

def get_or_create_caballo(conn, nombre, datos_extra={}):
    # FILTRO V17: Si no es nombre valido, se rechaza
    if not es_nombre_valido(nombre): return None
    
    nombre = norm_txt(nombre)
    if not nombre or len(nombre) < 2: return None
    
    cur = conn.cursor()
    cur.execute("SELECT * FROM Caballos WHERE nombre=?", (nombre,))
    row = cur.fetchone()
    
    sexo_derivado = None
    if datos_extra.get('pelo'): sexo_derivado = derivar_sexo(datos_extra['pelo'])
    ano_nac = None
    if datos_extra.get('edad') and datos_extra.get('fecha_ref'):
        try:
            fref = datetime.strptime(datos_extra['fecha_ref'], '%Y-%m-%d')
            ano_nac = fref.year - int(datos_extra['edad'])
        except: pass

    if row:
        idc = row[0]
        upd, vals = [], []
        if not row[2] and datos_extra.get('padre'): upd.append("padre=?"); vals.append(datos_extra['padre'])
        if not row[3] and datos_extra.get('madre'): upd.append("madre=?"); vals.append(datos_extra['madre'])
        if not row[4] and datos_extra.get('pelo'):  upd.append("pelo=?");  vals.append(datos_extra['pelo'])
        if not row[5] and sexo_derivado:            upd.append("sexo=?");  vals.append(sexo_derivado)
        if not row[6] and ano_nac:                  upd.append("ano_nacimiento=?"); vals.append(ano_nac)
        if upd:
            sql = f"UPDATE Caballos SET {', '.join(upd)} WHERE id_caballo=?"
            vals.append(idc)
            cur.execute(sql, tuple(vals))
            conn.commit()
        return idc
    else:
        cur.execute("INSERT INTO Caballos (nombre, padre, madre, pelo, sexo, ano_nacimiento) VALUES (?,?,?,?,?,?)",
                    (nombre, datos_extra.get('padre'), datos_extra.get('madre'), datos_extra.get('pelo'), sexo_derivado, ano_nac))
        conn.commit()
        return cur.lastrowid

def corregir_cuidador_stud(cuid, stud):
    c = norm_txt(cuid)
    s = norm_txt(stud)
    studs_conocidos = ['L.C.J.', 'L.C.J', 'LCJ', 'MIS NIETOS', 'LA POROTA', 'EL BEDUINO']
    es_stud_en_cuid = False
    if c in studs_conocidos: es_stud_en_cuid = True
    elif len(c) <= 4 and len(c) > 0 and "." in c: es_stud_en_cuid = True 
    if es_stud_en_cuid and len(s) > 5:
        return s, c 
    return cuid, stud

# --- PROGRAMA ---
def procesar_programa(ruta, conn):
    print(f"PROG: {os.path.basename(ruta)}")
    try: df = pd.read_excel(ruta, header=None).fillna('')
    except: return

    texto_dump = " ".join(df.astype(str).values.flatten())
    fecha = parsear_fecha_reunion(texto_dump)
    if not fecha: fecha = parsear_fecha_reunion(os.path.basename(ruta))
    if not fecha: return
    fecha_str = fecha.strftime('%Y-%m-%d')

    filas_carrera = []
    for idx, row in df.iterrows():
        if re.search(r'\b\d+(?:°|º|ª)?\s*CARRERA\b', " ".join(row.astype(str)).upper()):
            filas_carrera.append(idx)

    for i, inicio in enumerate(filas_carrera):
        fin = filas_carrera[i+1] if i+1 < len(filas_carrera) else len(df)
        bloque_header = df.iloc[inicio:min(inicio+10, fin)]
        txt_header = " ".join(bloque_header.iloc[:, 1:].astype(str).values.flatten())
        
        txt_carrera_linea = " ".join(df.iloc[inicio].astype(str)).upper()
        nro_carrera = limpiar_nro_carrera(txt_carrera_linea)
        if nro_carrera == 1 and i > 0: nro_carrera = i + 1 
        
        distancia = limpiar_distancia(txt_header)
        premio = "CARRERA CONCERTADA" if (distancia and distancia <= 600) else "Premio " + (re.search(r'["“](.+?)["”]', txt_header).group(1).upper() if re.search(r'["“](.+?)["”]', txt_header) else "Sin Nombre")

        fila_titulos = None
        col_map = {}
        for r_idx in range(inicio, min(inicio+15, fin)):
            row_vals = [str(x).upper().strip() for x in df.iloc[r_idx]]
            if "CABALLO" in row_vals:
                fila_titulos = r_idx
                for c, val in enumerate(row_vals):
                    if "CABALLO" in val: col_map['caballo'] = c
                    elif "JOCKEY" in val: col_map['jockey'] = c
                    elif "CUIDADOR" in val: col_map['cuidador'] = c
                    elif "CABALLERIZA" in val or "STUD" in val: col_map['stud'] = c
                    elif "PELO" in val: col_map['pelo'] = c
                    elif "PADRE" in val: col_map['padre'] = c
                    elif "E" == val or "EDAD" in val: col_map['edad'] = c
                    elif "Nº" in val or "N°" in val: col_map['mandil'] = c
                break
        
        start_data = (fila_titulos + 1) if fila_titulos else (inicio + 2)

        for r in range(start_data, fin):
            row = df.iloc[r]
            try:
                datos = {}
                nombre = None
                if fila_titulos and 'caballo' in col_map:
                    raw_nom = str(row.iloc[col_map['caballo']])
                    # FILTRO V17: Nombre valido?
                    if es_nombre_valido(raw_nom):
                        nombre = raw_nom
                        for k, v in col_map.items():
                            if k != 'caballo': datos[k] = str(row.iloc[v])
                else:
                    if len(row) > 8:
                        posible_nom = str(row.iloc[2])
                        # FILTRO V17: Nombre valido?
                        if es_nombre_valido(posible_nom):
                            nombre = posible_nom
                            datos['pelo'] = str(row.iloc[3])
                            val_J = str(row.iloc[9]).strip() if len(row) > 9 else ""
                            if len(val_J) > 3:
                                datos['stud'] = str(row.iloc[8])
                                datos['cuidador'] = val_J
                                datos['padre'] = str(row.iloc[7])
                            else:
                                datos['padre'] = str(row.iloc[6])
                                datos['stud'] = str(row.iloc[7])
                                datos['cuidador'] = str(row.iloc[8])
                            try: datos['edad'] = str(row.iloc[5]).split()[0]
                            except: pass
                            try: datos['mandil'] = int(float(str(row.iloc[1])))
                            except: pass

                if nombre and "CARRERA" not in norm_txt(nombre):
                    p, m = None, None
                    if datos.get('padre') and '-' in datos.get('padre'):
                        parts = datos['padre'].split('-')
                        p, m = parts[0].strip(), parts[1].strip()
                    else: p = datos.get('padre')

                    c_raw = datos.get('cuidador')
                    s_raw = datos.get('stud')
                    c_final, s_final = corregir_cuidador_stud(c_raw, s_raw)

                    idc = get_or_create_caballo(conn, nombre, {
                        'padre': p, 'madre': m, 'pelo': datos.get('pelo'),
                        'edad': datos.get('edad'), 'fecha_ref': fecha_str
                    })
                    
                    if idc:
                        cur = conn.cursor()
                        cur.execute("""
                            UPDATE Actuaciones 
                            SET cuidador=?, caballeriza=?, jockey=COALESCE(?, jockey), nro_mandil=?, distancia=?, premio=?
                            WHERE id_caballo=? AND fecha=? AND nro_carrera=?
                        """, (c_final, s_final, datos.get('jockey'), datos.get('mandil'), distancia, premio,
                              idc, fecha_str, nro_carrera))
                        
                        if cur.rowcount == 0:
                            cur.execute("""
                                INSERT INTO Actuaciones 
                                (id_caballo, fecha, nro_carrera, premio, distancia, jockey, cuidador, caballeriza, nro_mandil)
                                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                            """, (idc, fecha_str, nro_carrera, premio, distancia, 
                                  datos.get('jockey'), c_final, s_final, datos.get('mandil')))
                        conn.commit()
            except Exception as e: pass

# --- RESULTADO ---
def procesar_resultado(ruta, conn):
    print(f"RES: {os.path.basename(ruta)}")
    try: df = pd.read_excel(ruta, header=None).fillna('')
    except: return

    texto_dump = " ".join(df.astype(str).values.flatten())
    fecha = parsear_fecha_reunion(texto_dump)
    if not fecha: fecha = parsear_fecha_reunion(os.path.basename(ruta))
    if not fecha: return
    fecha_str = fecha.strftime('%Y-%m-%d')

    filas_carrera = []
    for idx, row in df.iterrows():
        if re.search(r'\b\d+(?:°|º|ª)?\s*CARRERA\b', " ".join(row.astype(str)).upper()):
            filas_carrera.append(idx)

    for i, inicio in enumerate(filas_carrera):
        fin = filas_carrera[i+1] if i+1 < len(filas_carrera) else len(df)
        bloque_header = df.iloc[inicio:min(inicio+10, fin)]
        txt_header = " ".join(bloque_header.iloc[:, 1:].astype(str).values.flatten())
        
        txt_carrera_linea = " ".join(df.iloc[inicio].astype(str)).upper()
        nro_carrera_raw = limpiar_nro_carrera(txt_carrera_linea)
        if nro_carrera_raw == 1 and i > 0: nro_carrera_raw = i + 1

        distancia_real = limpiar_distancia(txt_header)
        premio_real = None
        if distancia_real:
            if distancia_real <= 600: premio_real = "CARRERA CONCERTADA"
            else:
                 m_prem = re.search(r'(?:PREMIO|CLASICO|ESPECIAL|GRAN PREMIO)\s*["“](.+?)["”]', txt_header, re.I)
                 if m_prem: premio_real = m_prem.group(1).upper()
        
        estado_pista_real = extraer_estado_pista(txt_header)

        txt_footer = " ".join(df.iloc[min(inicio+10, fin-5):fin].astype(str).values.flatten())
        stud_ganador, cuid_ganador = None, None
        m_stud = re.search(r'Stud[:\.]\s*(.+?)(?:\s+(?:Cuidador|Procedencia|Tiempo)|\s{2,}|\n|$)', txt_footer, re.I)
        if m_stud: stud_ganador = m_stud.group(1).strip()
        m_cuid = re.search(r'Cuidador[:\.]\s*(.+?)(?:\s+(?:Procedencia|Stud|Tiempo)|\s{2,}|\n|$)', txt_footer, re.I)
        if m_cuid: cuid_ganador = m_cuid.group(1).strip()

        col_puesto, col_caballo, start_table = -1, -1, inicio
        for r in range(inicio, min(inicio+15, fin)):
            row = df.iloc[r]
            for c in range(len(row)):
                val = str(row.iloc[c]).strip().upper()
                if val == '1' or val == '1RO':
                    if (c+1 < len(row) and len(str(row.iloc[c+1])) > 3): 
                        col_puesto, col_caballo = c, c+1
                        start_table = r; break
                    elif (c+2 < len(row) and len(str(row.iloc[c+2])) > 3):
                        col_puesto, col_caballo = c, c+2
                        start_table = r; break
            if col_puesto != -1: break
            
        if col_puesto != -1:
            for r in range(start_table, fin):
                row = df.iloc[r]
                puesto_raw = str(row.iloc[col_puesto]).strip().upper()
                texto_fila = " ".join(row.astype(str)).upper()

                nombre, motivo_nc, es_nc = None, None, False
                if "NO CORRIO" in texto_fila or "RETIRADO" in texto_fila:
                    m_ret = re.search(r'(?:NO CORRIO|RETIRADO)[:\s]+(?:\(.*\))?\s*([A-Z\s]+)(?:\((.*)\))?', texto_fila)
                    if m_ret:
                        nombre = m_ret.group(1).strip()
                        raw_motivo = m_ret.group(2).strip() if m_ret.group(2) else "Retirado"
                        motivo_nc = estandarizar_observacion(raw_motivo)
                        es_nc = True
                elif re.match(r'^(\d+|U|NC)$', puesto_raw):
                    nombre = str(row.iloc[col_caballo]).strip()
                
                # FILTRO V17: RECHAZA TABULADAS EN RESULTADOS
                if not es_nombre_valido(nombre): continue

                jockey = None
                # BUSQUEDA DINAMICA DE JOCKEY V17:
                # Si col_caballo+2 es un numero (kilos), probamos la siguiente (col+3)
                if not es_nc:
                    idx_jockey = col_caballo + 2
                    if idx_jockey < len(row):
                        posible_jockey = str(row.iloc[idx_jockey]).strip()
                        if posible_jockey.replace('.','').isdigit() or len(posible_jockey) < 3:
                            # Parece kilo, probamos +1
                            if idx_jockey + 1 < len(row):
                                jockey = str(row.iloc[idx_jockey + 1])
                        else:
                            jockey = posible_jockey

                cuid_actual, stud_actual = None, None
                if puesto_raw == '1' or puesto_raw == '1RO':
                    cuid_actual, stud_actual = cuid_ganador, stud_ganador
                
                idc = get_or_create_caballo(conn, nombre)
                
                if idc:
                    cur = conn.cursor()
                    cur.execute("SELECT nro_carrera FROM Actuaciones WHERE id_caballo=? AND fecha=?", (idc, fecha_str))
                    row_exist = cur.fetchone()
                    
                    if row_exist:
                        target_nro = row_exist[0]
                        if es_nc:
                            cur.execute("""
                                UPDATE Actuaciones SET puesto_final='NC', observacion=?, premio=COALESCE(?, premio), distancia=COALESCE(?, distancia), estado_pista=COALESCE(?, estado_pista)
                                WHERE id_caballo=? AND fecha=? AND nro_carrera=?
                            """, (motivo_nc, premio_real, distancia_real, estado_pista_real, idc, fecha_str, target_nro))
                        else:
                            # Protegemos el premio original si el nuevo es generico
                            premio_final = premio_real if premio_real and "SIN NOMBRE" not in premio_real.upper() else None
                            
                            cur.execute("""
                                UPDATE Actuaciones 
                                SET puesto_original=?, puesto_final=?, 
                                    jockey=COALESCE(?, jockey), 
                                    premio=COALESCE(?, premio), distancia=COALESCE(?, distancia), estado_pista=COALESCE(?, estado_pista)
                                WHERE id_caballo=? AND fecha=? AND nro_carrera=?
                            """, (puesto_raw, puesto_raw if puesto_raw!='U' else 'NC', 
                                  jockey, 
                                  premio_final, distancia_real, estado_pista_real,
                                  idc, fecha_str, target_nro))
                    else:
                        if es_nc:
                            cur.execute("INSERT INTO Actuaciones (id_caballo, fecha, nro_carrera, puesto_final, observacion, premio, distancia, estado_pista) VALUES (?,?,?,?,?,?,?,?)",
                                        (idc, fecha_str, nro_carrera_raw, 'NC', motivo_nc, premio_real, distancia_real, estado_pista_real))
                        else:
                            cur.execute("""
                                INSERT INTO Actuaciones 
                                (id_caballo, fecha, nro_carrera, puesto_original, puesto_final, jockey, cuidador, caballeriza, premio, distancia, estado_pista)
                                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                            """, (idc, fecha_str, nro_carrera_raw, puesto_raw, puesto_raw if puesto_raw!='U' else 'NC', 
                                  jockey, cuid_actual, stud_actual, premio_real, distancia_real, estado_pista_real))
                    conn.commit()

if __name__ == "__main__":
    crear_base_de_datos()
    progs = sorted([os.path.join(CARPETA_PROGRAMAS, f) for f in os.listdir(CARPETA_PROGRAMAS) if f.endswith(('xlsx', 'xls')) and not f.startswith('~$')])
    for p in progs: procesar_programa(p, sqlite3.connect(DATABASE_FILE))
    
    res = sorted([os.path.join(CARPETA_RESULTADOS, f) for f in os.listdir(CARPETA_RESULTADOS) if f.endswith(('xlsx', 'xls')) and not f.startswith('~$')])
    for r in res: procesar_resultado(r, sqlite3.connect(DATABASE_FILE))
    print("--- FIN V17.0 (ANTI-TABULADAS Y JOCKEY DINAMICO) ---")