import pandas as pd
import sqlite3
import os
import re
from datetime import datetime

print(">>> INICIANDO PROCESAMIENTO V94 (PREMIOS CON COMILLAS + BORRADOS ';' + CUERPOS)...")

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
    t_clean = re.sub(r'[\(\)\*]', '', t).replace('DIST', '').strip()
    if len(t_clean) > 28 or len(t_clean) < 2: return False 
    if t_clean and t_clean[0].isdigit(): return False 
    
    blacklist = ["PREMIO", "CLASICO", "CARRERA", "DISTANCIA", "METROS", "TIEMPO", "RECORD", "APUESTA", "GANADOR", "DIVIDENDOS", "ESPECIAL", "GRAN PREMIO", "HANDICAP", "INSCRIPTOS", "RATIFICADOS", "S.P.C", "CABALLO", "NO CORRIERON"]
    if any(x in t_clean for x in blacklist): return False

    patrones = [r'\bCP\b', r'\bCPOS\b', r'\bPZO\b', r'\bCZA\b', r'\bHOC\b', r'\bAL\s+\d', r'\d{2}/\d{2}', r'\bVS\b', r'\bDE\b.{3,}\bDE\b', r'GANO A', r'PERDIO CON']
    for pat in patrones:
        if re.search(pat, t_clean): return False
    
    if " DE " in t_clean:
        nombres_con_de = ["FLOR DE", "HIJO DE", "OJO DE", "LUZ DE", "MAR DE", "SOL DE", "ALMA DE", "NOCHE DE", "DAMA DE", "REINA DE", "REY DE", "CITY DE", "GOL DE", "OJO DE"]
        if not any(x in t_clean for x in nombres_con_de): return False

    return True

def es_fila_basura_o_tabulada(texto_fila):
    t = str(texto_fila).upper()
    # Proteger notas de distanciamiento
    if "TRATAMIENTO" in t or "MEDICAMENTOSO" in t or "DISTANCIADO" in t: return False
    
    # Freno de mano
    if "TIEMPO:" in t or "TIEMPO :" in t: return True
    if "DIVIDENDOS" in t or "APUESTA" in t: return True
    if "NO CORRI" in t or "RETIRADO" in t: return True 

    if re.search(r'\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2}', t): return True
    if re.search(r'\d+\'\d+', t): return True
    if re.search(r'[\-\s](PN|PP|PH|PB|PF)[\-\s]', t): return True
    if "CP DE" in t or "CPOS DE" in t: return True
    if re.search(r'\d+[º°]?\s+A\s+\d', t): return True
    return False

def limpiar_premio_v94(txt_header):
    """
    V94: Soporte estricto para PREMIO "NOMBRE" y variantes.
    """
    if not txt_header: return "Sin Nombre"
    
    # Aplanar y normalizar comillas (convertir todo a comilla simple o doble estandar)
    flat = re.sub(r'\s+', ' ', str(txt_header)).upper()
    flat = flat.replace('""', '"').replace("''", "'").replace("“", '"').replace("”", '"')

    # 1. Caso: PALABRA CLAVE + COMILLAS -> GRAN PREMIO "BATALLA"
    # Captura: (TIPO) " (NOMBRE) "
    m_quote = re.search(r'(GRAN PREMIO|CLASICO|ESPECIAL|HANDICAP|COPA|PREMIO)\s*["\']([^"\']+)["\']', flat)
    if m_quote:
        tipo = m_quote.group(1).strip()
        nombre = m_quote.group(2).strip()
        # Limpieza extra del nombre
        nombre = re.split(r'[\-\d]|METROS', nombre)[0].strip()
        return f"{tipo} {nombre}"

    # 2. Caso: SOLO COMILLAS -> "DIA DEL MAESTRO"
    m_only_quote = re.search(r'["\']([^"\']+)["\']', flat)
    if m_only_quote:
        nombre = m_only_quote.group(1).strip()
        if len(nombre) > 3 and not es_fila_basura_o_tabulada(nombre):
            # Si no dice Premio, le agregamos "Premio" por defecto si no es clasico
            return f"PREMIO {nombre}"

    # 3. Caso: PALABRA CLAVE SIN COMILLAS -> CLASICO APERTURA
    m_plain = re.search(r'(GRAN PREMIO|CLASICO|ESPECIAL|HANDICAP|COPA|PREMIO)\s+([A-Z\s\.]+)', flat)
    if m_plain:
        tipo = m_plain.group(1).strip()
        raw_nombre = m_plain.group(2).strip()
        # Cortar antes de basura
        nombre = re.split(r'[\-\d]|METROS|DISTANCIA', raw_nombre)[0].strip()
        if len(nombre) > 3:
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
    if "PISTA NORMAL" in t or "ESTADO DE PISTA: NORMAL" in t: return "Normal"
    if "PISTA PESADA" in t: return "Pesada"
    if "PISTA HUMEDA" in t: return "Humeda"
    if "PISTA BARROSA" in t: return "Barrosa"
    if "PISTA FANGOSA" in t: return "Fangosa"
    m_sigla = re.search(r'(?:^|[\s\-])P\.?\s*([BNHPF])\.?(?:[\s\-]|$)', t)
    if m_sigla:
        letra = m_sigla.group(1)
        mapa = {'N':'Normal','B':'Barrosa','H':'Humeda','P':'Pesada','F':'Fangosa'}
        return mapa.get(letra)
    if "NORMAL" in t and "ANORMAL" not in t: return "Normal"
    if "PESADA" in t: return "Pesada"
    if "HUMEDA" in t: return "Humeda"
    if "FANGOSA" in t: return "Fangosa"
    if "BARROSA" in t: return "Barrosa"
    return None

def extraer_pista_global(df_raw):
    head_txt = " ".join(df_raw.iloc[:25].astype(str).values.flatten()).upper()
    return extraer_estado_pista(head_txt)

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

# --- CALCULADORA DE CUERPOS ---
def parsear_cuerpos_a_float(txt_cuerpos):
    if not txt_cuerpos: return 0.0
    t = str(txt_cuerpos).upper().replace(' ', '')
    
    no_suman = ["V.M", "HOC", "CZA", "S.A", "S/A", "EMP", "PUESTO"]
    for x in no_suman:
        if x in t: return 0.0
    
    if "1/2CZA" in t or "1/2PZO" in t: return 0.0
    
    val = 0.0
    if "PZO" in t: val += 0.25
    
    m_int = re.search(r'(\d+)', t)
    if m_int: val += float(m_int.group(1))
    
    if "1/2" in t: val += 0.5
    elif "3/4" in t: val += 0.75
    elif "1/4" in t: val += 0.25
    
    return val

def formatear_float_a_cuerpos(valor):
    if valor == 0: return ""
    entero = int(valor)
    decimal = valor - entero
    
    if 0.20 < decimal < 0.30: decimal = 0.25
    elif 0.45 < decimal < 0.55: decimal = 0.5
    elif 0.70 < decimal < 0.80: decimal = 0.75
    elif decimal < 0.10: decimal = 0
    elif decimal > 0.90: entero += 1; decimal = 0
    
    frac_str = ""
    if decimal == 0.25: frac_str = "1/4"
    elif decimal == 0.5: frac_str = "1/2"
    elif decimal == 0.75: frac_str = "3/4"
    
    if entero > 0 and frac_str: return f"{entero} {frac_str} cp"
    elif entero > 0: return f"{entero} cp"
    elif frac_str: return f"{frac_str} cp"
    return ""

# --- DB ---
def crear_base_de_datos():
    if os.path.exists(DATABASE_FILE):
        try: os.remove(DATABASE_FILE); print(">>> DB Vieja eliminada (V94).")
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
            cuerpos TEXT, cuerpos_acumulados TEXT,
            FOREIGN KEY(id_caballo) REFERENCES Caballos(id_caballo),
            UNIQUE(id_caballo, fecha, nro_carrera) 
        )''')
    conn.commit()
    conn.close()

def get_or_create_caballo(conn, nombre, datos_extra={}):
    if not es_nombre_valido(nombre): return None
    nombre = norm_txt(nombre).replace('(*)', '').replace('*', '').strip()
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
            if fref.month < 7: ano_nac = fref.year - edad_int - 1
            else: ano_nac = fref.year - edad_int
        except: pass

    if row:
        idc = row[0]
        upd, vals = [], []
        if datos_extra.get('padre'): upd.append("padre=?"); vals.append(datos_extra['padre'])
        if datos_extra.get('madre'): upd.append("madre=?"); vals.append(datos_extra['madre'])
        if datos_extra.get('pelo'):  upd.append("pelo=?");  vals.append(datos_extra['pelo'])
        if sexo_derivado: upd.append("sexo=?"); vals.append(sexo_derivado)
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
    studs_conocidos = ['L.C.J.', 'L.C.J', 'LCJ', 'MIS NIETOS', 'LA POROTA', 'EL BEDUINO', 'S/D', 'DON LILO', 'DON VALENTIN', 'DON TATA', 'DON PEPE', 'EL POBRE']
    if c in studs_conocidos or "STUD" in c or "CABALLERIZA" in c: return c, "S/D"
    if (c in studs_conocidos) and (s not in studs_conocidos): return s, c 
    return cuid, stud

def recalcular_posiciones_v94(competidores, footer_txt):
    footer = str(footer_txt).upper()
    es_medicamentoso = "MEDICAMENTOSO" in footer or "TRATAMIENTO" in footer
    es_molestia = "MOLESTAR" in footer or "DISTANCIADO AL" in footer
    
    m_pos = re.search(r'(?:DIST|MOLEST)[A-Z\.\s]*AL\s+(\d{1,2})', footer)
    target_pos = int(m_pos.group(1)) if m_pos else None
    if target_pos and target_pos > 25: target_pos = None

    culpables = [c for c in competidores if c['asterisco']]
    if not culpables:
        for c in competidores: 
            if c['puesto_raw'] == 'U':
                max_pos = 0
                for op in competidores:
                    if op['puesto_raw'].isdigit():
                        if int(op['puesto_raw']) > max_pos: max_pos = int(op['puesto_raw'])
                c['puesto_final'] = str(max_pos + 1)
            else: c['puesto_final'] = c['puesto_raw']
        return competidores

    validos, otros = [], []
    max_pos_real = 0
    for c in competidores:
        if c['puesto_raw'].isdigit():
            pos = int(c['puesto_raw'])
            if pos > max_pos_real: max_pos_real = pos
    for c in competidores:
        raw = c['puesto_raw']
        if raw.isdigit(): c['puesto_num'] = int(raw); validos.append(c)
        elif raw == 'U': c['puesto_num'] = max_pos_real + 1; validos.append(c)
        else: c['puesto_final'] = raw; c['puesto_num'] = 9999; otros.append(c)
    validos.sort(key=lambda x: x['puesto_num'])
    
    tipo_sancion = 'DOPING_DEFAULT'
    if es_molestia and target_pos: tipo_sancion = 'MOLESTIA'
    elif es_medicamentoso: tipo_sancion = 'DOPING'
    
    if tipo_sancion == 'DOPING' or tipo_sancion == 'DOPING_DEFAULT':
        puesto_virtual = 1
        for c in validos:
            if c['asterisco']: c['puesto_final'] = 'DD'; c['obs'] = 'Distanciado por tratamiento' if tipo_sancion == 'DOPING' else 'Distanciado'
            else: c['puesto_final'] = str(puesto_virtual); puesto_virtual += 1
    elif tipo_sancion == 'MOLESTIA':
        culpable = [c for c in validos if c['asterisco']][0]
        pos_orig = culpable['puesto_num']
        culpable['puesto_final'] = str(target_pos); culpable['obs'] = 'Distanciado por molestias'
        for c in validos:
            if c == culpable: continue
            if c['puesto_num'] > pos_orig and c['puesto_num'] <= target_pos: c['puesto_final'] = str(c['puesto_num'] - 1)
            else: c['puesto_final'] = str(c['puesto_num'])
    return validos + otros

# --- V94: LIMPIEZA CON SPLIT POR PUNTO Y COMA ---
def verificar_y_borrar_no_corrieron_v94(conn, footer_txt, fecha_str, nro_carrera):
    footer_upper = str(footer_txt).upper()
    m = re.search(r'(?:NO CORRIERON|NO CORRIO)[:\s]+', footer_upper)
    if not m: return
    
    texto_nc = footer_upper[m.end():]
    idx_corte = len(texto_nc)
    for sep in ["CUIDADOR", "PROCEDENCIA", "TIEMPO", "RECORD", "DIVIDENDOS", "GANADOR"]:
        i = texto_nc.find(sep)
        if i != -1 and i < idx_corte: idx_corte = i
    texto_nc = texto_nc[:idx_corte]

    # TRITURADORA: Cortar por ; o , o Y
    partes = re.split(r'[;,\.]|\s+Y\s+', texto_nc)
    
    for parte in partes:
        nombre_limpio = re.sub(r'\(\d+[A-Z]?\)', '', parte).strip()
        nombre_limpio = norm_txt(nombre_limpio)
        
        if len(nombre_limpio) < 3: continue
        
        es_retiro = "PARTIDOR" in parte or "RETIRAD" in parte or "ESCAP" in parte
        
        cur = conn.cursor()
        cur.execute("SELECT id_caballo FROM Caballos WHERE nombre=?", (nombre_limpio,))
        row = cur.fetchone()
        if row:
            idc = row[0]
            if es_retiro:
                print(f"   [V94] UPDATE RETIRADO: {nombre_limpio}")
                cur.execute("""
                    UPDATE Actuaciones SET puesto_final='NC', observacion='Retirado de los partidores'
                    WHERE id_caballo=? AND fecha=? AND nro_carrera=?
                """, (idc, fecha_str, nro_carrera))
            else:
                print(f"   [V94] DELETE NO CORRIO: {nombre_limpio}")
                cur.execute("DELETE FROM Actuaciones WHERE id_caballo=? AND fecha=? AND nro_carrera=?", (idc, fecha_str, nro_carrera))
            conn.commit()

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
        premio = "CARRERA CONCERTADA" if (distancia and distancia <= 600) else limpiar_premio_v94(txt_header)
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
                        nombre = raw_nom.replace('(*)', '').replace('*', '').strip()
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
                                if '-' in s and len(s) > 10 and not re.search(r'\d', s): idx_pedigree = k; break
                        if idx_pedigree != -1:
                            datos['padre'] = str(row.iloc[idx_pedigree])
                            candidatos = []
                            for k in range(idx_pedigree + 1, len(row)):
                                val = str(row.iloc[k]).strip()
                                if val and val.upper() != 'NAN' and len(val) > 2 and not val.replace('.','').isdigit(): candidatos.append(val)
                            if len(candidatos) >= 2: datos['stud'] = candidatos[0]; datos['cuidador'] = candidatos[1]
                            elif len(candidatos) == 1: datos['stud'] = candidatos[0]
                if nombre:
                    if not datos.get('stud') or not datos.get('cuidador'):
                        tail_vals = [str(x).strip() for x in row if str(x).strip() and len(str(x))>3]
                        if len(tail_vals) >= 2: datos['cuidador'] = tail_vals[-1]; datos['stud'] = tail_vals[-2]
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

# --- RESULTADO ---
def procesar_resultado(ruta, conn):
    print(f"RES: {os.path.basename(ruta)}")
    try: df = pd.read_excel(ruta, header=None).fillna('')
    except: return
    pista_global = extraer_pista_global(df)
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
        premio_real = "CARRERA CONCERTADA" if (distancia_real and distancia_real <= 600) else limpiar_premio_v94(txt_header)
        estado_pista_real = extraer_estado_pista(txt_header)
        if not estado_pista_real: estado_pista_real = pista_global
        txt_footer = " ".join(df.iloc[min(inicio+10, fin):fin].astype(str).values.flatten())
        tiempo_real = extraer_tiempo_carrera(txt_footer)
        col_puesto, col_caballo, start_table = -1, -1, inicio
        for r in range(inicio, min(inicio+15, fin)):
            row = df.iloc[r]
            texto_fila = " ".join(row.astype(str)).upper()
            if es_fila_basura_o_tabulada(texto_fila): continue
            for c in range(len(row)):
                val = str(row.iloc[c]).strip().upper()
                if val == '1' or val == '1RO':
                    if (c+1 < len(row) and len(str(row.iloc[c+1])) > 3): col_puesto, col_caballo = c, c+1; start_table = r; break
                    elif (c+2 < len(row) and len(str(row.iloc[c+2])) > 3): col_puesto, col_caballo = c, c+2; start_table = r; break
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
                if "TIEMPO:" in texto_fila or "TIEMPO :" in texto_fila: break
                if "NO CORRI" in texto_fila or "RETIRADO" in texto_fila: break 
                if "DIVIDENDOS" in texto_fila: break
                if es_fila_basura_o_tabulada(texto_fila): continue
                if "TEENEK" in texto_fila and fecha_str == "2022-06-12": continue
                puesto_raw = str(row.iloc[col_puesto]).strip().upper()
                nombre_raw = None
                if re.match(r'^(\d+|U|NC|DD)$', puesto_raw):
                    if col_caballo < len(row): nombre_raw = str(row.iloc[col_caballo]).strip()
                tiene_asterisco = False
                if nombre_raw:
                    if '(*)' in nombre_raw or '*' in nombre_raw or '(*)' in texto_fila:
                        tiene_asterisco = True
                        nombre_raw = nombre_raw.replace('(*)', '').replace('*', '').strip()
                if not es_nombre_valido(nombre_raw): continue
                cuerpos, cuerpos_acum = None, None
                vals_fila = [str(x).strip() for x in row if str(x).strip() and str(x).upper() != 'NAN']
                if len(vals_fila) > 3:
                    cand_acum = vals_fila[-1]
                    cand_int = vals_fila[-2]
                    if re.search(r'\d', cand_acum) and len(cand_acum) < 10: cuerpos_acum = cand_acum
                    if re.search(r'\d', cand_int) and len(cand_int) < 10: cuerpos = cand_int
                    elif "PZO" in cand_int or "CZA" in cand_int or "HCO" in cand_int: cuerpos = cand_int
                jockey = None
                for k in range(col_caballo + 1, min(col_caballo + 4, len(row))):
                    val = str(row.iloc[k]).strip()
                    if len(val) > 3 and not val.replace('.','').isdigit(): jockey = val; break
                competidores.append({
                    'nombre': nombre_raw,
                    'puesto_raw': puesto_raw,
                    'jockey': jockey,
                    'asterisco': tiene_asterisco,
                    'cuerpos': cuerpos,
                    'cuerpos_acum': cuerpos_acum
                })
            
            competidores_finales = recalcular_posiciones_v94(competidores, txt_footer)
            acumulado_real = 0.0
            for comp in competidores_finales:
                valor_cuerpos = parsear_cuerpos_a_float(comp.get('cuerpos', ''))
                acumulado_real += valor_cuerpos
                if comp['puesto_final'] == '1' or comp['puesto_final'] == 'DD':
                    val_acum_db = ''
                    acumulado_real = 0.0
                else:
                    if comp.get('cuerpos_acum'): val_acum_db = comp['cuerpos_acum']
                    else: val_acum_db = formatear_float_a_cuerpos(acumulado_real)
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
                            UPDATE Actuaciones SET puesto_final=?, observacion=?, premio=COALESCE(?, premio), distancia=COALESCE(?, distancia), estado_pista=COALESCE(?, estado_pista), tiempo_carrera=COALESCE(?, tiempo_carrera), cuerpos=?, cuerpos_acumulados=?
                            WHERE id_caballo=? AND fecha=? AND nro_carrera=?
                        """, (puesto_fin, obs_val, premio_real, distancia_real, estado_pista_real, tiempo_real, comp.get('cuerpos'), val_acum_db, idc, fecha_str, target_nro))
                    else:
                        cur.execute("""
                            INSERT INTO Actuaciones 
                            (id_caballo, fecha, nro_carrera, puesto_original, puesto_final, jockey, premio, distancia, estado_pista, tiempo_carrera, observacion, cuerpos, cuerpos_acumulados)
                            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                        """, (idc, fecha_str, nro_carrera, comp['puesto_raw'], puesto_fin, 
                              comp['jockey'], premio_real, distancia_real, estado_pista_real, tiempo_real, obs_val, comp.get('cuerpos'), val_acum_db))
                    conn.commit()
        verificar_y_borrar_no_corrieron_v94(conn, txt_footer, fecha_str, nro_carrera)

if __name__ == "__main__":
    crear_base_de_datos()
    progs = sorted([os.path.join(CARPETA_PROGRAMAS, f) for f in os.listdir(CARPETA_PROGRAMAS) if f.endswith(('xlsx', 'xls')) and not f.startswith('~$')])
    for p in progs: procesar_programa(p, sqlite3.connect(DATABASE_FILE))
    res = sorted([os.path.join(CARPETA_RESULTADOS, f) for f in os.listdir(CARPETA_RESULTADOS) if f.endswith(('xlsx', 'xls')) and not f.startswith('~$')])
    for r in res: procesar_resultado(r, sqlite3.connect(DATABASE_FILE))
    print("--- FIN V94 (BORRADO NUCLEAR POR FECHA + FORMATO CUERPOS) ---")