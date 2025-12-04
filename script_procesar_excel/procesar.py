import pandas as pd
import sqlite3
import os
import re
from datetime import datetime

print(">>> INICIANDO PROCESAMIENTO V51 (COORDENADAS FIJAS: COL I=STUD, COL J=CUIDADOR)...")

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
    s = s.replace('Á','A').replace('É','E').replace('Í','I').replace('Ó','O').replace('Ú','U').replace('Ñ','N')
    s = s.replace('"', '').replace("'", "")
    s = re.sub(r'\s+', ' ', s)
    return s

def es_peso_valido(texto):
    if not texto: return False
    raw = str(texto).strip()
    if "'" in raw or '"' in raw: return False
    return bool(re.search(r'\b[4-6]\d(\.|,)?\d?\b', raw))

def es_pelaje_valido(texto):
    if not texto: return False
    t = norm_txt(texto)
    if len(t) < 3: return False
    pelajes = ['ZAIN', 'ALAZ', 'TORDI', 'OSC', 'ZNI', 'ALZ', 'ZD', 'ZN', 'GATEADO', 'LOBUNO', 'MORO', 'ROSILO', 'PICAZO', 'RUIANO', 'BAYO', 'TOSTADO', 'OVERO', 'BLANCO', 'COLORADO', 'DORADILLO', 'TICUAN', 'A.T.', 'Z.D.', 'Z.N.']
    for p in pelajes:
        if p in t: return True
    return False

def es_nombre_valido(texto):
    if not texto: return False
    t = norm_txt(texto)
    if len(t) > 28 or len(t) < 2: return False 
    if t[0].isdigit(): return False 
    
    blacklist = ["PREMIO", "CLASICO", "CARRERA", "DISTANCIA", "METROS", "TIEMPO", "RECORD", "APUESTA", "GANADOR", "DIVIDENDOS", "ESPECIAL", "GRAN PREMIO", "HANDICAP", "INSCRIPTOS", "RATIFICADOS"]
    if any(x in t for x in blacklist): return False

    patrones = [
        r'\bCP\b', r'\bCPOS\b', r'\bPZO\b', r'\bCZA\b', r'\bHOC\b', 
        r'\bAL\s+\d', r'\d{2}/\d{2}', r'\bVS\b', 
        r'\bDE\b.{3,}\bDE\b',
        r'GANO A', r'PERDIO CON'
    ]
    for pat in patrones:
        if re.search(pat, t): return False
    
    if " DE " in t:
        nombres_con_de = ["FLOR DE", "HIJO DE", "OJO DE", "LUZ DE", "MAR DE", "SOL DE", "ALMA DE", "NOCHE DE", "DAMA DE", "REINA DE", "REY DE", "CITY DE", "GOL DE", "OJO DE"]
        if not any(x in t for x in nombres_con_de): return False

    return True

def es_fila_basura_o_tabulada(texto_fila):
    t = str(texto_fila).upper()
    if re.search(r'\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2}', t): return True
    if re.search(r'\d+\'\d+', t): return True
    if re.search(r'[\-\s](PN|PP|PH|PB|PF)[\-\s]', t): return True
    if "CP DE" in t or "CPOS DE" in t: return True
    if re.search(r'\d+[º°]?\s+A\s+\d', t): return True
    return False

def limpiar_premio_v51(txt_header):
    if not txt_header: return "Sin Nombre"
    
    clean_header = txt_header.replace('""', '"')
    
    m_comillas = re.search(r'["“](.+?)["”]', clean_header)
    if m_comillas:
        candidato = m_comillas.group(1).upper()
        if not es_fila_basura_o_tabulada(candidato) and len(candidato) > 3:
            m_tipo = re.search(r'(GRAN PREMIO|CLASICO|ESPECIAL|HANDICAP|COPA)', clean_header, re.I)
            if m_tipo: return f"{m_tipo.group(1).upper()} {candidato}"
            return "Premio " + candidato

    keywords = ["GRAN PREMIO", "CLASICO", "ESPECIAL", "HANDICAP", "COPA", "PREMIO"]
    pattern = r'(?:' + '|'.join(keywords) + r')\s+([A-Z\s\.]+)'
    m_prem = re.search(pattern, clean_header, re.I)
    if m_prem:
        tipo = re.search(r'(?:' + '|'.join(keywords) + r')', m_prem.group(0), re.I).group(0).upper()
        nombre = m_prem.group(1).strip().upper()
        nombre = re.split(r'[\-\d]', nombre)[0].strip()
        if len(nombre) > 3 and not es_fila_basura_o_tabulada(nombre):
            return f"{tipo} {nombre}"

    # Fallback Mayusculas
    lineas = clean_header.split('\n')
    if len(lineas) == 1: lineas = re.split(r'\s{3,}', clean_header)
    for l in lineas:
        l = l.strip().upper()
        if "RECORD DIST" in l or "PESO" in l or "GANADOR" in l: continue
        if len(l) > 5 and re.match(r'^[A-Z\s\.]+$', l):
             if not any(x in l for x in ["HIPODROMO", "TUCUMAN", "PROGRAMA", "COMISION", "APUESTA"]):
                 return "Premio " + l
    return "Sin Nombre"

def estandarizar_observacion(texto):
    if not texto: return None
    t = texto.upper()
    if any(x in t for x in ["RETIRADO", "ESCAP", "DISPAR", "NEGÓ", "PARTIDORES"]): return "Retirado de los partidores"
    if "ROD" in t: return "Rodó"
    if "DIST" in t: return "Distanciado"
    if "SUJETA" in t or "SOFREN" in t: return "Sofrenó"
    return texto.capitalize()

def limpiar_distancia_header(texto):
    if not texto: return None
    t = str(texto).upper()
    t_clean = re.sub(r'(?<=\d)\.(?=\d)', '', t) 
    m_expl = re.search(r'(?<!\d)(\d{3,4})\s*(?:MTS|M|METROS)\b', t_clean, re.I)
    if m_expl: 
        d = int(m_expl.group(1))
        if d not in [2020, 2021, 2022, 2023, 2024, 2025, 2026]: return d
    return None

def separar_edad_peso(texto_celda):
    if not texto_celda: return None, None
    s = str(texto_celda).strip()
    numeros = re.findall(r'\d+', s)
    edad, peso = None, None
    if len(numeros) >= 2:
        n1, n2 = int(numeros[0]), int(numeros[1])
        if n1 < 20: edad = str(n1)
        if n2 > 40: peso = str(n2)
    elif len(numeros) == 1:
        n = int(numeros[0])
        if n < 20: edad = str(n)
        elif n > 40: peso = str(n)
    return edad, peso

def limpiar_edad(texto_celda):
    if not texto_celda: return None
    s = str(texto_celda).strip()
    if not any(char.isdigit() for char in s): return None
    m = re.search(r'\d+', s)
    if m: return m.group()
    return None

def limpiar_nro_carrera(texto):
    if not texto: return 1
    t = norm_txt(texto)
    m = re.search(r'\b(\d+)(?:°|º|ª|DA|RA|TA|MO)?\s*CARRERA', t)
    if m: return int(m.group(1))
    if t.isdigit() and int(t) < 25: return int(t)
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
    matches = re.findall(r'(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})', texto)
    for d_str, m_str, y_str in matches:
        try:
            d, M, y = int(d_str), int(m_str), int(y_str)
            if y < 100: y += 2000
            if 1 <= M <= 12 and 1 <= d <= 31: return datetime(y, M, d)
        except: continue
    return None

def derivar_sexo(pelo):
    if not pelo: return "Macho"
    p = norm_txt(pelo)
    if "YEGUA" in p: return "Hembra"
    if p.endswith("A") and not p.endswith("O") and "COLORADO" not in p and "DORADILLO" not in p: return "Hembra"
    return "Macho"

# --- DB ---
def crear_base_de_datos():
    if os.path.exists(DATABASE_FILE):
        try: os.remove(DATABASE_FILE); print(">>> DB Vieja eliminada (V51).")
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
    if not es_nombre_valido(nombre): return None
    nombre = norm_txt(nombre)
    if not nombre or len(nombre) < 2: return None
    cur = conn.cursor()
    cur.execute("SELECT * FROM Caballos WHERE nombre=?", (nombre,))
    row = cur.fetchone()
    
    sexo_derivado = None
    if datos_extra.get('pelo'): sexo_derivado = derivar_sexo(datos_extra['pelo'])
    
    ano_nac = None
    edad_str = datos_extra.get('edad')
    if edad_str and edad_str.isdigit() and datos_extra.get('fecha_ref'):
        try:
            fref = datetime.strptime(datos_extra['fecha_ref'], '%Y-%m-%d')
            edad_int = int(edad_str)
            if fref.month < 7:
                ano_nac = fref.year - edad_int - 1
            else:
                ano_nac = fref.year - edad_int
        except: pass

    if row:
        idc = row[0]
        upd, vals = [], []
        if datos_extra.get('padre'): upd.append("padre=?"); vals.append(datos_extra['padre'])
        if datos_extra.get('madre'): upd.append("madre=?"); vals.append(datos_extra['madre'])
        if datos_extra.get('pelo'):  upd.append("pelo=?");  vals.append(datos_extra['pelo'])
        if sexo_derivado:            upd.append("sexo=?");  vals.append(sexo_derivado)
        if ano_nac:                  upd.append("ano_nacimiento=?"); vals.append(ano_nac)
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
    studs_conocidos = [
        'L.C.J.', 'L.C.J', 'LCJ', 'MIS NIETOS', 'LA POROTA', 'EL BEDUINO', 'S/D', 
        'DON LILO', 'DON VALENTIN', 'DON TATA', 'DON PEPE', 'EL POBRE'
    ]
    if c in studs_conocidos or "STUD" in c or "CABALLERIZA" in c:
        return c, "S/D"
    if (c in studs_conocidos) and (s not in studs_conocidos):
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
        
        bloque_header = df.iloc[inicio:min(inicio+40, fin)]
        txt_header = " ".join(bloque_header.iloc[:, 1:].astype(str).values.flatten())
        
        txt_carrera_linea = " ".join(df.iloc[inicio].astype(str)).upper()
        nro_carrera = limpiar_nro_carrera(txt_carrera_linea)
        if nro_carrera == 1 and i > 0: nro_carrera = i + 1 
        
        distancia = limpiar_distancia_header(txt_header)
        premio = "CARRERA CONCERTADA" if (distancia and distancia <= 600) else limpiar_premio_v51(txt_header)

        # En V51 ya no usamos col_map para buscar columnas I y J, 
        # pero si necesitamos saber DONDE empiezan los caballos.
        fila_titulos = None
        for r_idx in range(inicio, min(inicio+20, fin)):
            row_vals = [str(x).upper().strip() for x in df.iloc[r_idx]]
            if any(k in row_vals for k in ["CABALLO", "S.P.C", "SPC", "EJEMPLAR", "S.P.C.", "ANIMAL"]):
                fila_titulos = r_idx
                break
        
        start_data = (fila_titulos + 1) if fila_titulos else (inicio + 2)

        for r in range(start_data, fin):
            row = df.iloc[r]
            texto_fila_completa = " ".join(row.astype(str)).upper()
            
            if es_fila_basura_o_tabulada(texto_fila_completa): continue
            if "TEENEK" in texto_fila_completa and fecha_str == "2022-06-12": continue

            try:
                datos = {}
                nombre = None
                
                # BUSCAMOS NOMBRE (Suele estar en col 2)
                # Pero validamos que no sea basura
                if len(row) > 2:
                    posible_nom = str(row.iloc[2])
                    if es_nombre_valido(posible_nom):
                        nombre = posible_nom
                
                if nombre:
                    # --- EXTRACCION DE DATOS V51 (MODO RIGIDO) ---
                    
                    # 1. Pelo (Col 3)
                    if len(row) > 3: datos['pelo'] = str(row.iloc[3])
                    
                    # 2. Jockey (Col 4)
                    if len(row) > 4: datos['jockey'] = str(row.iloc[4])
                    
                    # 3. Edad/Kilos (Col 5)
                    if len(row) > 5:
                        raw_ekg = str(row.iloc[5])
                        e, p = separar_edad_peso(raw_ekg)
                        if e: datos['edad'] = e
                        if p: datos['peso'] = p
                        
                    # 4. Padre (Col 6)
                    if len(row) > 6: datos['padre'] = str(row.iloc[6])
                    
                    # 5. STUD (Col 8 / I) - IGNORAMOS LA 7 (H) PORQUE ESTA VACIA
                    if len(row) > 8:
                        val_stud = str(row.iloc[8]).strip()
                        if len(val_stud) > 2: datos['stud'] = val_stud
                        
                    # 6. CUIDADOR (Col 9 / J)
                    if len(row) > 9:
                        val_cuid = str(row.iloc[9]).strip()
                        if len(val_cuid) > 2: datos['cuidador'] = val_cuid
                        
                    # 7. Mandil (Col 1)
                    try: datos['mandil'] = int(float(str(row.iloc[1])))
                    except: pass
                    
                    # ---------------------------------------------

                    p, m = None, None
                    raw_p = datos.get('padre', '')
                    if raw_p and '-' in raw_p:
                        parts = raw_p.split('-')
                        if len(parts) >= 2: p, m = parts[0].strip(), parts[1].strip()
                    elif raw_p: p = raw_p.strip()

                    c_final, s_final = corregir_cuidador_stud(datos.get('cuidador'), datos.get('stud'))

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

# --- RESULTADO (V51) ---
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
        nro_carrera = limpiar_nro_carrera(txt_carrera_linea)
        if nro_carrera == 1 and i > 0: nro_carrera = i + 1

        distancia_real = limpiar_distancia_header(txt_header)
        premio_real = "CARRERA CONCERTADA" if (distancia_real and distancia_real <= 600) else limpiar_premio_v51(txt_header)
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
            texto_fila = " ".join(row.astype(str)).upper()
            if es_fila_basura_o_tabulada(texto_fila): continue

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
            
        if col_puesto == -1:
             try:
                 posible_puesto = str(df.iloc[inicio+6, 1]).strip()
                 if posible_puesto == '1': col_puesto = 1; col_caballo = 2; start_table = inicio + 6
             except: pass

        if col_puesto != -1:
            for r in range(start_table, fin):
                row = df.iloc[r]
                texto_fila = " ".join(row.astype(str)).upper()
                
                if es_fila_basura_o_tabulada(texto_fila): continue
                if "TEENEK" in texto_fila and fecha_str == "2022-06-12": continue

                puesto_raw = str(row.iloc[col_puesto]).strip().upper()

                nombre, motivo_nc, es_nc = None, None, False
                if "NO CORRIO" in texto_fila or "RETIRADO" in texto_fila:
                    m_ret = re.search(r'(?:NO CORRIO|RETIRADO)[:\s]+(?:\(.*\))?\s*([A-Z\s]+)(?:\((.*)\))?', texto_fila)
                    if m_ret:
                        nombre = m_ret.group(1).strip()
                        raw_motivo = m_ret.group(2).strip() if m_ret.group(2) else "Retirado"
                        motivo_nc = estandarizar_observacion(raw_motivo)
                        es_nc = True
                elif re.match(r'^(\d+|U|NC)$', puesto_raw):
                    if col_caballo < len(row): nombre = str(row.iloc[col_caballo]).strip()
                
                if not es_nombre_valido(nombre): continue
                
                jockey = None
                if not es_nc:
                    for k in range(col_caballo + 1, min(col_caballo + 4, len(row))):
                        val = str(row.iloc[k]).strip()
                        if len(val) > 3 and not val.replace('.','').isdigit():
                            jockey = val; break

                cuid_actual, stud_actual = None, None
                if puesto_raw == '1' or puesto_raw == '1RO': cuid_actual, stud_actual = cuid_ganador, stud_ganador
                
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
                            premio_final = premio_real if premio_real and "SIN NOMBRE" not in premio_real.upper() else None
                            cur.execute("""
                                UPDATE Actuaciones 
                                SET puesto_original=?, puesto_final=?, 
                                    jockey=COALESCE(?, jockey), 
                                    premio=COALESCE(?, premio), distancia=COALESCE(?, distancia), estado_pista=COALESCE(?, estado_pista)
                                WHERE id_caballo=? AND fecha=? AND nro_carrera=?
                            """, (puesto_raw, puesto_raw if puesto_raw!='U' else 'NC', 
                                  jockey, premio_final, distancia_real, estado_pista_real, idc, fecha_str, target_nro))
                    else:
                        if es_nc:
                            cur.execute("INSERT INTO Actuaciones (id_caballo, fecha, nro_carrera, puesto_final, observacion, premio, distancia, estado_pista) VALUES (?,?,?,?,?,?,?,?)",
                                        (idc, fecha_str, nro_carrera, 'NC', motivo_nc, premio_real, distancia_real, estado_pista_real))
                        else:
                            cur.execute("""
                                INSERT INTO Actuaciones 
                                (id_caballo, fecha, nro_carrera, puesto_original, puesto_final, jockey, cuidador, caballeriza, premio, distancia, estado_pista)
                                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                            """, (idc, fecha_str, nro_carrera, puesto_raw, puesto_raw if puesto_raw!='U' else 'NC', 
                                  jockey, cuid_actual, stud_actual, premio_real, distancia_real, estado_pista_real))
                    conn.commit()

if __name__ == "__main__":
    crear_base_de_datos()
    progs = sorted([os.path.join(CARPETA_PROGRAMAS, f) for f in os.listdir(CARPETA_PROGRAMAS) if f.endswith(('xlsx', 'xls')) and not f.startswith('~$')])
    for p in progs: procesar_programa(p, sqlite3.connect(DATABASE_FILE))
    res = sorted([os.path.join(CARPETA_RESULTADOS, f) for f in os.listdir(CARPETA_RESULTADOS) if f.endswith(('xlsx', 'xls')) and not f.startswith('~$')])
    for r in res: procesar_resultado(r, sqlite3.connect(DATABASE_FILE))
    print("--- FIN V51 (COORDENADAS FIJAS COL I/J) ---")