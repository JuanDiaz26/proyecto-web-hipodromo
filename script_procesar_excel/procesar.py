import pandas as pd
import sqlite3
import os
import re
from datetime import datetime

print(">>> INICIANDO PROCESAMIENTO V66 (PROTECCIÓN DE NOTAS DE DISTANCIAMIENTO)...")

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
    
    blacklist = ["PREMIO", "CLASICO", "CARRERA", "DISTANCIA", "METROS", "TIEMPO", "RECORD", "APUESTA", "GANADOR", "DIVIDENDOS", "ESPECIAL", "GRAN PREMIO", "HANDICAP", "INSCRIPTOS", "RATIFICADOS", "S.P.C", "CABALLO"]
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
    """
    V66: PROTEGE las líneas que hablan de distanciamiento.
    Si dice 'TRATAMIENTO' o 'DISTANCIADO', NO ES BASURA, es información vital.
    """
    t = str(texto_fila).upper()
    
    # --- PROTECCIÓN V66 ---
    if "TRATAMIENTO" in t or "MEDICAMENTOSO" in t or "DISTANCIADO POR" in t:
        return False # No es basura, queremos leerla
    # ----------------------

    if re.search(r'\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2}', t): return True
    if re.search(r'\d+\'\d+', t): return True
    if re.search(r'[\-\s](PN|PP|PH|PB|PF)[\-\s]', t): return True
    if "CP DE" in t or "CPOS DE" in t: return True
    if re.search(r'\d+[º°]?\s+A\s+\d', t): return True
    return False

def limpiar_premio_v55(txt_header):
    if not txt_header: return "Sin Nombre"
    flat = re.sub(r'\s+', ' ', txt_header).upper().replace('""', '"').replace("''", "'")
    m_comillas = re.search(r'["“](.+?)["”]', flat)
    if m_comillas:
        candidato = m_comillas.group(1).strip()
        if not es_fila_basura_o_tabulada(candidato) and len(candidato) > 3:
            idx = m_comillas.start()
            window = flat[max(0, idx-30):idx]
            m_tipo = re.search(r'(GRAN PREMIO|CLASICO|ESPECIAL|HANDICAP|COPA)', window)
            if m_tipo: return f"{m_tipo.group(1)} {candidato}"
            return "Premio " + candidato

    keywords = ["GRAN PREMIO", "CLASICO", "ESPECIAL", "HANDICAP", "COPA", "PREMIO"]
    pattern = r'(?:' + '|'.join(keywords) + r')\s+([A-Z\s\.]+)'
    m_prem = re.search(pattern, flat)
    if m_prem:
        tipo = re.search(r'(?:' + '|'.join(keywords) + r')', m_prem.group(0)).group(0)
        nombre = m_prem.group(1).strip()
        nombre = re.split(r'[\-\d]|METROS|DISTANCIA', nombre)[0].strip()
        if len(nombre) > 3 and not es_fila_basura_o_tabulada(nombre):
            return f"{tipo} {nombre}"
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
        elif n1 > 40: peso = str(n1)
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

def extraer_tiempo_carrera(texto_footer):
    if not texto_footer: return None
    t = str(texto_footer).upper()
    m = re.search(r'(?:TIEMPO|TPO)[\.\:]?\s*([0-9\'\"\s\/]+)', t)
    if m:
        tiempo = m.group(1).strip()
        if len(tiempo) > 2: return tiempo
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
        try: os.remove(DATABASE_FILE); print(">>> DB Vieja eliminada (V66).")
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
        if sexo_derivado:
            upd.append("sexo=?")
            vals.append(sexo_derivado)
        if ano_nac: upd.append("ano_nacimiento=?"); vals.append(ano_nac)
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

# --- LOGICA REORDENAMIENTO (MOTOR V66) ---
def recalcular_posiciones_v66(competidores, footer_txt):
    footer = str(footer_txt).upper()
    es_medicamentoso = "MEDICAMENTOSO" in footer or "TRATAMIENTO" in footer
    es_molestia = "MOLESTAR" in footer or "DISTANCIADO AL" in footer
    
    culpables = [c for c in competidores if c['asterisco']]
    
    if not culpables:
        # Sin distanciados
        for c in competidores: 
            if c['puesto_raw'] == 'U':
                # Logica simple para U si no hay lio
                max_pos = 0
                for op in competidores:
                    if op['puesto_raw'].isdigit():
                        if int(op['puesto_raw']) > max_pos: max_pos = int(op['puesto_raw'])
                c['puesto_final'] = str(max_pos + 1)
            else:
                c['puesto_final'] = c['puesto_raw']
        return competidores

    # Si hay culpables, analizamos
    print(f"   >>> DETECTADO DISTANCIAMIENTO: {culpables[0]['nombre']}")

    validos = []
    otros = []
    
    # Calcular maximo para la U
    max_pos_real = 0
    for c in competidores:
        if c['puesto_raw'].isdigit():
            pos = int(c['puesto_raw'])
            if pos > max_pos_real: max_pos_real = pos
            
    for c in competidores:
        raw = c['puesto_raw']
        if raw.isdigit():
            c['puesto_num'] = int(raw)
            validos.append(c)
        elif raw == 'U':
            c['puesto_num'] = max_pos_real + 1
            validos.append(c)
        else:
            c['puesto_final'] = raw
            c['puesto_num'] = 9999
            otros.append(c)

    validos.sort(key=lambda x: x['puesto_num'])
    
    if es_medicamentoso:
        # DOPING
        puesto_actual = 1
        for c in validos:
            if c['asterisco']:
                c['puesto_final'] = 'DD'
                c['obs'] = 'Distanciado por tratamiento'
            else:
                c['puesto_final'] = str(puesto_actual)
                puesto_actual += 1
                
    elif es_molestia:
        # MOLESTIA
        m_pos = re.search(r'AL\s+(\d+)', footer)
        target_pos = int(m_pos.group(1)) if m_pos else None
        
        if target_pos:
            culpable = [c for c in validos if c['asterisco']][0]
            culpable['puesto_final'] = str(target_pos)
            culpable['obs'] = 'Distanciado por molestias'
            
            pos_orig = culpable['puesto_num']
            for c in validos:
                if c == culpable: continue
                
                if c['puesto_num'] > pos_orig and c['puesto_num'] <= target_pos:
                    c['puesto_final'] = str(c['puesto_num'] - 1)
                else:
                    c['puesto_final'] = str(c['puesto_num'])
        else:
            for c in validos: c['puesto_final'] = str(c['puesto_num'])
            for c in culpables: c['obs'] = 'Distanciado'
    else:
        # Generico
        for c in validos: c['puesto_final'] = str(c['puesto_num'])
        for c in culpables: c['obs'] = 'Distanciado'

    return validos + otros

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
        premio = "CARRERA CONCERTADA" if (distancia and distancia <= 600) else limpiar_premio_v55(txt_header)

        fila_titulos = None
        col_map = {}
        for r_idx in range(inicio, min(inicio+20, fin)):
            row_vals = [str(x).upper().strip() for x in df.iloc[r_idx]]
            if any(k in row_vals for k in ["CABALLO", "S.P.C", "SPC", "EJEMPLAR", "S.P.C.", "ANIMAL"]):
                fila_titulos = r_idx
                for c, val in enumerate(row_vals):
                    if "E KG" in val or "E.KG" in val or "E/KG" in val: col_map['edad_peso_combo'] = c
                    elif "CABALLO" in val or "S.P.C" in val: col_map['caballo'] = c
                    elif "JOCKEY" in val: col_map['jockey'] = c
                    elif "PELO" in val: col_map['pelo'] = c
                    elif "PADRE" in val: col_map['padre'] = c
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
                idx_nom = col_map.get('caballo', 2)
                if len(row) > idx_nom:
                    raw_nom = str(row.iloc[idx_nom])
                    if es_nombre_valido(raw_nom):
                        nombre = raw_nom
                        if 'pelo' in col_map: datos['pelo'] = str(row.iloc[col_map['pelo']])
                        elif len(row) > 3: datos['pelo'] = str(row.iloc[3])
                        if 'jockey' in col_map: datos['jockey'] = str(row.iloc[col_map['jockey']])
                        elif len(row) > 4: datos['jockey'] = str(row.iloc[4])
                        idx_ep = col_map.get('edad_peso_combo', 5)
                        if len(row) > idx_ep:
                            e, p = separar_edad_peso(str(row.iloc[idx_ep]))
                            if e: datos['edad'] = e
                            if p: datos['peso'] = p
                        if not datos.get('peso') and len(row) > 5:
                             raw_f = str(row.iloc[5])
                             e_res, p_res = separar_edad_peso(raw_f)
                             if p_res: datos['peso'] = p_res

                        idx_pedigree = -1
                        if 'padre' in col_map: idx_pedigree = col_map['padre']
                        else:
                            for k, celda in enumerate(row):
                                s = str(celda).strip()
                                if '-' in s and len(s) > 10 and not re.search(r'\d', s):
                                    idx_pedigree = k
                                    break
                        if idx_pedigree != -1:
                            datos['padre'] = str(row.iloc[idx_pedigree])
                            candidatos = []
                            for k in range(idx_pedigree + 1, len(row)):
                                val = str(row.iloc[k]).strip()
                                if val and val.upper() != 'NAN' and len(val) > 2 and not val.replace('.','').isdigit():
                                    candidatos.append(val)
                            if len(candidatos) >= 2:
                                datos['stud'] = candidatos[0]
                                datos['cuidador'] = candidatos[1]
                            elif len(candidatos) == 1:
                                datos['stud'] = candidatos[0]

                if nombre:
                    if not datos.get('stud') or not datos.get('cuidador'):
                        tail_vals = [str(x).strip() for x in row if str(x).strip() and len(str(x))>3]
                        if len(tail_vals) >= 2:
                             datos['cuidador'] = tail_vals[-1]
                             datos['stud'] = tail_vals[-2]

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
                            SET cuidador=?, caballeriza=?, jockey=COALESCE(?, jockey), peso=COALESCE(?, peso), nro_mandil=?, distancia=?, premio=?
                            WHERE id_caballo=? AND fecha=? AND nro_carrera=?
                        """, (c_final, s_final, datos.get('jockey'), datos.get('peso'), datos.get('mandil'), distancia, premio,
                              idc, fecha_str, nro_carrera))
                        if cur.rowcount == 0:
                            cur.execute("""
                                INSERT INTO Actuaciones 
                                (id_caballo, fecha, nro_carrera, premio, distancia, jockey, peso, cuidador, caballeriza, nro_mandil)
                                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                            """, (idc, fecha_str, nro_carrera, premio, distancia, 
                                  datos.get('jockey'), datos.get('peso'), c_final, s_final, datos.get('mandil')))
                        conn.commit()
            except Exception as e: pass

# --- RESULTADO (V66) ---
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
        premio_real = "CARRERA CONCERTADA" if (distancia_real and distancia_real <= 600) else limpiar_premio_v55(txt_header)
        estado_pista_real = extraer_estado_pista(txt_header)
        
        # V66: FOOTER EXTENDIDO
        txt_footer = " ".join(df.iloc[min(inicio+10, fin):fin].astype(str).values.flatten())
        tiempo_real = extraer_tiempo_carrera(txt_footer)
        
        col_puesto, col_caballo, start_table = -1, -1, inicio
        for r in range(inicio, min(inicio+15, fin)):
            row = df.iloc[r]
            texto_fila = " ".join(row.astype(str)).upper()
            # V66: NO DESCARTAR LINEAS DE DISTANCIAMIENTO
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
            competidores = []
            for r in range(start_table, fin):
                row = df.iloc[r]
                texto_fila = " ".join(row.astype(str)).upper()
                
                # V66: FILTRO INTELIGENTE
                # Si es linea de distanciamiento, no la descartamos como basura, pero NO ES UN CABALLO
                # Solo la usamos para contexto (ya leida en footer)
                if "TRATAMIENTO" in texto_fila or "DISTANCIADO" in texto_fila: continue
                if es_fila_basura_o_tabulada(texto_fila): continue
                
                if "TEENEK" in texto_fila and fecha_str == "2022-06-12": continue

                puesto_raw = str(row.iloc[col_puesto]).strip().upper()
                nombre_raw = None
                
                if "NO CORRIO" in texto_fila or "RETIRADO" in texto_fila:
                    m_ret = re.search(r'(?:NO CORRIO|RETIRADO)[:\s]+(?:\(.*\))?\s*([A-Z\s]+)(?:\((.*)\))?', texto_fila)
                    if m_ret: nombre_raw = m_ret.group(1).strip()
                elif re.match(r'^(\d+|U|NC|DD)$', puesto_raw):
                    if col_caballo < len(row): nombre_raw = str(row.iloc[col_caballo]).strip()
                
                tiene_asterisco = False
                if nombre_raw:
                    if '(*)' in nombre_raw or '*' in nombre_raw:
                        tiene_asterisco = True
                        nombre_raw = nombre_raw.replace('(*)', '').replace('*', '').strip()
                
                if not es_nombre_valido(nombre_raw): continue
                
                jockey = None
                for k in range(col_caballo + 1, min(col_caballo + 4, len(row))):
                    val = str(row.iloc[k]).strip()
                    if len(val) > 3 and not val.replace('.','').isdigit():
                        jockey = val; break
                
                competidores.append({
                    'nombre': nombre_raw,
                    'puesto_raw': puesto_raw,
                    'jockey': jockey,
                    'asterisco': tiene_asterisco
                })

            # V66: PASAR EL FOOTER COMPLETO
            competidores_finales = recalcular_posiciones_v66(competidores, txt_footer)
            
            for comp in competidores_finales:
                idc = get_or_create_caballo(conn, comp['nombre'])
                if idc:
                    cur = conn.cursor()
                    cur.execute("SELECT nro_carrera FROM Actuaciones WHERE id_caballo=? AND fecha=?", (idc, fecha_str))
                    row_exist = cur.fetchone()
                    obs_val = comp.get('obs')
                    puesto_fin = comp['puesto_final']
                    
                    if row_exist:
                        target_nro = row_exist[0]
                        cur.execute("""
                            UPDATE Actuaciones SET puesto_final=?, observacion=?, premio=COALESCE(?, premio), distancia=COALESCE(?, distancia), estado_pista=COALESCE(?, estado_pista), tiempo_carrera=COALESCE(?, tiempo_carrera)
                            WHERE id_caballo=? AND fecha=? AND nro_carrera=?
                        """, (puesto_fin, obs_val, premio_real, distancia_real, estado_pista_real, tiempo_real, idc, fecha_str, target_nro))
                    else:
                        cur.execute("""
                            INSERT INTO Actuaciones 
                            (id_caballo, fecha, nro_carrera, puesto_original, puesto_final, jockey, premio, distancia, estado_pista, tiempo_carrera, observacion)
                            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                        """, (idc, fecha_str, nro_carrera, comp['puesto_raw'], puesto_fin, 
                              comp['jockey'], premio_real, distancia_real, estado_pista_real, tiempo_real, obs_val))
                    conn.commit()

if __name__ == "__main__":
    crear_base_de_datos()
    progs = sorted([os.path.join(CARPETA_PROGRAMAS, f) for f in os.listdir(CARPETA_PROGRAMAS) if f.endswith(('xlsx', 'xls')) and not f.startswith('~$')])
    for p in progs: procesar_programa(p, sqlite3.connect(DATABASE_FILE))
    res = sorted([os.path.join(CARPETA_RESULTADOS, f) for f in os.listdir(CARPETA_RESULTADOS) if f.endswith(('xlsx', 'xls')) and not f.startswith('~$')])
    for r in res: procesar_resultado(r, sqlite3.connect(DATABASE_FILE))
    print("--- FIN V66 (PROTECCIÓN DE NOTAS DE DISTANCIAMIENTO) ---")