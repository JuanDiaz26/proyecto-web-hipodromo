import pandas as pd
import sqlite3
import os
import re
from datetime import datetime

# --- CONFIG ---
CARPETA_PROGRAMAS = "programas"
CARPETA_RESULTADOS = "resultados"
DATABASE_FILE = "hipodromo_tucuman.db"

MESES_ES = {
    'ENERO': 1, 'FEBRERO': 2, 'MARZO': 3, 'ABRIL': 4, 'MAYO': 5, 'JUNIO': 6,
    'JULIO': 7, 'AGOSTO': 8, 'SEPTIEMBRE': 9, 'OCTUBRE': 10, 'NOVIEMBRE': 11, 'DICIEMBRE': 12
}

# Columnas hardcodeadas para el formato VIEJO (0-indexed)
# Ajustado: A veces Nro esta en Col A(0) o B(1). Caballo en C(2) o D(3).
# Vamos a usar una logica dinamica abajo, pero esto sirve de base.
COL_MAP_VIEJO_BASE = {
    'NRO': 1, 'CABALLO': 2, 'PELO': 3, 'JOCKEY': 4, 'E': 5, 'KG': 6,
    'PADRE_MADRE': 7, 'CABALLERIZA': 8, 'CUIDADOR': 9
}

# ---------- util ----------
def norm_txt(s):
    if s is None: return ""
    s = str(s).upper().strip()
    s = re.sub(r'\s+', ' ', s)
    s = (s.replace('Á','A').replace('É','E').replace('Í','I')
          .replace('Ó','O').replace('Ú','U').replace('Ñ','N'))
    return s

def to_float_or_none(x):
    if x is None: return None
    s = str(x).strip().lower().replace('kg','').replace(',', '.')
    s = re.sub(r'[^0-9.\-]', '', s)
    try:
        return float(s) if s != '' else None
    except:
        return None

def get_excel_files(folder_path):
    out = []
    for root, _, files in os.walk(folder_path):
        for f in files:
            if f.startswith('~$') or f.startswith('.'):
                continue
            if f.lower().endswith(('.xlsx', '.xls')):
                out.append(os.path.join(root, f))
    return out

def get_sort_key_from_filename(filepath):
    fn = os.path.basename(filepath)
    m = re.search(r'(20\d{2})', fn)
    if m:
        y = m.group(1)
        m2 = re.search(r'(\d{2})[^\d]?(\d{2})', fn)
        return f"{y}{m2.group(1)}{m2.group(2)}" if m2 else f"{y}0000"
    return "00000000"

def derivar_sexo(pelo):
    if not pelo or pd.isna(pelo): return None
    t = str(pelo).lower()
    if t.endswith('a'): return 'Hembra'
    if t.endswith('o'): return 'Macho'
    return 'Macho'

def calcular_ano_nacimiento(fecha_carrera, edad_texto):
    try:
        edad = int(re.search(r'(\d+)', str(edad_texto)).group(1))
    except Exception:
        return None
    cumple_este_ano = datetime(fecha_carrera.year, 7, 1)
    if fecha_carrera < cumple_este_ano:
        ano_cumple = fecha_carrera.year - 1
        ano_nac = ano_cumple - edad
    else:
        ano_nac = fecha_carrera.year - edad
    return int(ano_nac)

def parsear_fecha_reunion(texto):
    if not texto or not isinstance(texto, str): return None
    m = re.search(r'(\d{1,2})\s+DE\s+([A-ZÁÉÍÓÚÑ]+)\s+DE\s+(\d{4})', texto, re.I)
    if m:
        d = int(m.group(1)); mes = norm_txt(m.group(2)); y = int(m.group(3))
        if mes in MESES_ES: return datetime(y, MESES_ES[mes], d)
    m = re.search(r'(\d{2})/(\d{2})/(\d{4})', texto)
    if m:
        d, M, y = map(int, m.groups()); return datetime(y, M, d)
    m = re.search(r'(\d{2})-(\d{2})-(\d{2})', texto)
    if m:
        d, M = int(m.group(1)), int(m.group(2)); y = int("20"+m.group(3))
        return datetime(y, M, d)
    return None

# ====== extractores ======
def _extraer_tiempo_limpio(df_carrera):
    raw = next((str(c) for _, r in df_carrera.iterrows()
                for c in r if re.search(r'tiempo', str(c), re.I)), "N/D")
    m = re.search(r"\d+'\d{2}\"\s*\d\/\d|\d+'\d{2}\"", raw)
    return m.group(0).strip() if m else "N/D"

def _extraer_estado_pista(df_carrera):
    txt = ' '.join(df_carrera.apply(lambda r: ' '.join(r.astype(str)), axis=1)).upper()
    if 'BARROSA' in txt or 'P.B' in txt: return 'PB'
    if 'PESADA' in txt:  return 'PP'
    if 'HUMEDA' in txt or 'HÚMEDA' in txt: return 'PH'
    if 'FANGOSA' in txt: return 'PF'
    if 'NORMAL' in txt:  return 'PN'
    return 'PN'

def extraer_distancia_general(texto):
    if not texto: return None
    t = " " + texto.lower() + " "
    t = re.sub(r'(?<=\d)\.(?=\d{3})', "", t)
    
    # Regla estricta: numero + mts/m/metros
    m = re.search(r'(?<![\d\$,\.])(\d{3,4})\s*(mts?|metros?|m)\b', t, flags=re.I)
    if m: return int(m.group(1))
    
    # Regla: "Distancia: 1400"
    m = re.search(r'distancia\s*[:\-]?\s*(\d{3,4})\b', t, flags=re.I)
    if m: return int(m.group(1))
    
    return None

def extraer_premio_general(texto):
    m = re.search(r"(PREMIO|CLASICO|ESPECIAL|GRAN PREMIO)\s*['\"“‘](.+?)['\"”’]", texto, re.I)
    if m:
        return f'{m.group(1).upper()} "{m.group(2).strip().upper()}"'
    return None

# ---------- DB ----------
def crear_base_de_datos():
    if os.path.exists(DATABASE_FILE):
        os.remove(DATABASE_FILE)
        print(f"Base de datos '{DATABASE_FILE}' existente eliminada.")
    with sqlite3.connect(DATABASE_FILE) as conn:
        c = conn.cursor()
        c.execute('''
        CREATE TABLE Caballos(
            id_caballo INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL UNIQUE,
            padre TEXT, madre TEXT, pelo TEXT, sexo TEXT, ano_nacimiento INTEGER
        )''')
        c.execute('''
        CREATE TABLE Actuaciones(
            id_actuacion INTEGER PRIMARY KEY AUTOINCREMENT,
            id_caballo INTEGER NOT NULL,
            fecha TEXT,
            nro_carrera INTEGER,
            premio TEXT,
            distancia INTEGER,
            puesto_original INTEGER,
            puesto_final TEXT,
            jockey TEXT,
            peso REAL,
            cuidador TEXT,
            caballeriza TEXT,
            diferencias TEXT,
            dividendo REAL,
            tiempo_carrera TEXT,
            estado_pista TEXT,
            nro_mandil INTEGER,
            observacion TEXT,
            FOREIGN KEY(id_caballo) REFERENCES Caballos(id_caballo)
        )''')
        c.execute('CREATE UNIQUE INDEX ux_act ON Actuaciones(id_caballo, fecha, nro_carrera)')
    print(f"Base de datos '{DATABASE_FILE}' y tablas creadas exitosamente.")

def actualizar_o_crear_caballo(conn, nombre, padre=None, madre=None, pelo=None, sexo=None, ano_nac=None):
    cur = conn.cursor()
    cur.execute("SELECT * FROM Caballos WHERE nombre=?", (nombre,))
    row = cur.fetchone()
    if row:
        idc, _, p, m, pe, s, an = row
        sets, vals = [], []
        if (not p) and padre: sets.append("padre=?"); vals.append(padre)
        if (not m) and madre: sets.append("madre=?"); vals.append(madre)
        if (not pe) and pelo:  sets.append("pelo=?");  vals.append(pelo)
        if (not s) and sexo:   sets.append("sexo=?");  vals.append(sexo)
        if (not an) and ano_nac: sets.append("ano_nacimiento=?"); vals.append(ano_nac)
        if sets:
            cur.execute("UPDATE Caballos SET "+", ".join(sets)+" WHERE id_caballo=?",
                        tuple(vals+[idc])); conn.commit()
        return idc
    cur.execute("INSERT INTO Caballos(nombre, padre, madre, pelo, sexo, ano_nacimiento) VALUES(?,?,?,?,?,?)",
                (nombre, padre, madre, pelo, sexo, ano_nac))
    conn.commit()
    return cur.lastrowid

# ---------- Programas ----------
def find_col_index_by_keyword(header_row, keyword):
    for i, cell in enumerate(header_row):
        if keyword in str(cell).lower():
            return i
    return None

def parsear_programa(ruta, conn):
    print(f"--- Procesando PROGRAMA: {ruta} ---")
    try:
        df = pd.read_excel(ruta, sheet_name=0, header=None, dtype=str).fillna('')
    except Exception as e:
        print(f"Error al leer {ruta}: {e}"); return

    # fecha
    fecha = None
    for _, row in df.iterrows():
        for cell in row:
            f = parsear_fecha_reunion(cell)
            if f: fecha = f; break
        if fecha: break
    if not fecha:
        f = parsear_fecha_reunion(os.path.basename(ruta))
        if not f: print("  ADVERTENCIA: sin fecha -> salto."); return
        fecha = f
    print("Fecha encontrada:", fecha.strftime('%Y-%m-%d'))

    df_str = df.astype(str)

    # 1. Detectar Formato NUEVO (header explicito)
    header_indices = [idx for idx, row in df_str.iterrows() 
                      if any('caballo' in str(c).lower() for c in row) 
                      and any('cuidador' in str(c).lower() for c in row)]
    
    if header_indices:
        # --- FORMATO NUEVO (2025) ---
        print("     Formato NUEVO detectado.")
        
        # Filtro anti-duplicados estricto (15 filas)
        true_headers = [header_indices[0]]
        for k in range(1, len(header_indices)):
            if header_indices[k] > (header_indices[k-1] + 15):
                true_headers.append(header_indices[k])
        
        for i, hidx in enumerate(true_headers):
            inicio_bloque = max(0, hidx - 8)
            bloque = df.iloc[inicio_bloque:hidx+1]
            texto_bloque = " ".join(" ".join(map(str, r.values)) for _, r in bloque.iterrows())
            
            mcar = re.search(r'(\d+)\s*(?:°|ª)?\s*CARRERA', texto_bloque, re.I)
            nro = int(mcar.group(1)) if mcar else (i+1)

            dist = extraer_distancia_general(texto_bloque)
            premio = extraer_premio_general(texto_bloque)

            if dist is not None and dist <= 600:
                print(f"   N°{nro} | Distancia {dist}mts. Es cuadrera (programa), saltando carrera.")
                continue

            print(f"  N°{nro} | Distancia detectada: {dist} | Prem. tentativo: {premio}")
            
            header = df_str.iloc[hidx]
            col = {
                'CABALLO': find_col_index_by_keyword(header, 'caballo'),
                'PELO': find_col_index_by_keyword(header, 'pelo'),
                'JOCKEY': find_col_index_by_keyword(header, 'jockey'),
                'KG': find_col_index_by_keyword(header, 'kg'),
                'E': find_col_index_by_keyword(header, 'e'),
                'PADRE_MADRE': find_col_index_by_keyword(header, 'padre'),
                'CABALLERIZA': find_col_index_by_keyword(header, 'caballeriza'),
                'CUIDADOR': find_col_index_by_keyword(header, 'cuidador'),
                'NRO': find_col_index_by_keyword(header, 'nº') if find_col_index_by_keyword(header, 'nº') is not None else find_col_index_by_keyword(header, 'n°')
            }
            
            if col.get('CABALLO') is None: continue

            end = true_headers[i+1] if i+1 < len(true_headers) else len(df)
            r = hidx + 1
            while r < end:
                row = df.iloc[r]
                try:
                    nombre_raw = row.iloc[col['CABALLO']]
                    if not nombre_raw or pd.isna(nombre_raw): break
                    nombre = norm_txt(nombre_raw)
                    if not nombre or nombre == 'NAN' or len(nombre) < 3: break

                    pelo = (str(row.iloc[col['PELO']]).strip() if col['PELO'] is not None and pd.notna(row.iloc[col['PELO']]) else None)
                    sexo = derivar_sexo(pelo)
                    edad_texto = (str(row.iloc[col['E']]).strip() if col['E'] is not None and pd.notna(row.iloc[col['E']]) else None)
                    kg_texto = (str(row.iloc[col['KG']]).strip() if col['KG'] is not None and pd.notna(row.iloc[col['KG']]) else None)
                    ano_nac = calcular_ano_nacimiento(fecha, edad_texto) if edad_texto else None
                    peso = to_float_or_none(kg_texto)

                    padre, madre = None, None
                    if col['PADRE_MADRE'] is not None and pd.notna(row.iloc[col['PADRE_MADRE']]):
                        pm = str(row.iloc[col['PADRE_MADRE']]).strip()
                        if ' - ' in pm:
                            padre, madre = [x.strip() for x in pm.split(' - ', 1)]
                        else:
                            padre = pm

                    cuidador = (str(row.iloc[col['CUIDADOR']]).strip() if col['CUIDADOR'] is not None and pd.notna(row.iloc[col['CUIDADOR']]) else None)
                    caballeriza = (str(row.iloc[col['CABALLERIZA']]).strip() if col['CABALLERIZA'] is not None and pd.notna(row.iloc[col['CABALLERIZA']]) else None)
                    jockey = (str(row.iloc[col['JOCKEY']]).strip() if col['JOCKEY'] is not None and pd.notna(row.iloc[col['JOCKEY']]) else None)
                    nro_mandil = None
                    if col.get('NRO') is not None and pd.notna(row.iloc[col['NRO']]):
                        try: nro_mandil = int(str(row.iloc[col['NRO']]).strip())
                        except: nro_mandil = None

                    idc = actualizar_o_crear_caballo(conn, nombre, padre, madre, pelo, sexo, ano_nac)
                    cur = conn.cursor()
                    cur.execute('''
                        INSERT OR IGNORE INTO Actuaciones
                        (id_caballo, fecha, nro_carrera, premio, distancia, puesto_original, puesto_final,
                         jockey, peso, cuidador, caballeriza, diferencias, dividendo, tiempo_carrera,
                         estado_pista, nro_mandil, observacion)
                        VALUES (?, ?, ?, ?, ?, NULL, NULL, ?, ?, ?, ?, NULL, NULL, NULL, NULL, ?, NULL)
                    ''', (idc, fecha.strftime('%Y-%m-%d'), nro, premio, dist, jockey, peso, cuidador, caballeriza, nro_mandil))
                    conn.commit()
                except: pass
                r += 1
    else:
        # --- FORMATO VIEJO (2023/2024) - Lógica Fuerza Bruta ---
        print("     Formato VIEJO detectado.")
        pattern = re.compile(r'(\d+)\s*(?:°|ª)?\s*CARRERA', re.I)
        
        # Buscamos anchors en CUALQUIER columna de las primeras 5
        anchors = [idx for idx, row in df_str.iterrows() if any(pattern.search(str(c)) for c in row.iloc[:5])]
        
        true_anchors = []
        if anchors:
            true_anchors.append(anchors[0])
            for k in range(1, len(anchors)):
                if anchors[k] > (anchors[k-1] + 15):
                    true_anchors.append(anchors[k])
        
        # Recorrer anchors y procesar
        for i, start in enumerate(true_anchors):
            end = true_anchors[i+1] if i+1 < len(true_anchors) else len(df)
            
            # Analizar TODO el bloque de texto hasta la proxima carrera para buscar datos generales
            # (Limitado a 30 filas para no leer basura)
            bloque_info = df.iloc[start:min(start+30, end)]
            texto_bloque = " ".join(" ".join(map(str, r.values)) for _, r in bloque_info.iterrows())
            texto_norm = norm_txt(texto_bloque)

            mc = pattern.search(texto_norm)
            nro = int(mc.group(1)) if mc else (i+1)

            dist = extraer_distancia_general(texto_bloque)
            premio = extraer_premio_general(texto_bloque)

            if dist is not None and dist <= 600:
                print(f"   N°{nro} | Distancia {dist}mts. Es cuadrera (programa), saltando carrera.")
                continue

            print(f"  N°{nro} | Distancia detectada: {dist} | Prem. tentativo: {premio}")

            # Buscar tabla de caballos FUERZA BRUTA
            # Buscamos filas donde col 1 o 2 tenga un numero y col 2 o 3 tenga texto (caballo)
            col = COL_MAP_VIEJO_BASE
            r = start
            found_data = False
            
            while r < end:
                row = df.iloc[r]
                if len(row) < 5: 
                    r+=1; continue
                
                # Intento de detectar fila de caballo
                try:
                    # Chequear si parece fila de datos
                    # A veces el Nro esta en col 1, a veces en 0. Caballo en 2 o 3.
                    posible_nro = str(row.iloc[1]).strip() # Asumimos Col B
                    posible_caballo = str(row.iloc[2]).strip() # Asumimos Col C
                    
                    if posible_nro.isdigit() and len(posible_caballo) > 3 and not "CARRERA" in posible_caballo:
                        # Es una fila de datos!
                        found_data = True
                        
                        nombre = norm_txt(posible_caballo)
                        pelo = str(row.iloc[3]).strip() if len(row)>3 else None
                        jockey = str(row.iloc[4]).strip() if len(row)>4 else None
                        # ... mapear el resto a ojo o dejar null
                        
                        sexo = derivar_sexo(pelo)
                        nro_mandil = int(posible_nro)
                        
                        # Guardar
                        idc = actualizar_o_crear_caballo(conn, nombre, None, None, pelo, sexo, None)
                        cur = conn.cursor()
                        cur.execute('''
                            INSERT OR IGNORE INTO Actuaciones
                            (id_caballo, fecha, nro_carrera, premio, distancia, puesto_original, puesto_final,
                             jockey, peso, cuidador, caballeriza, diferencias, dividendo, tiempo_carrera,
                             estado_pista, nro_mandil, observacion)
                            VALUES (?, ?, ?, ?, ?, NULL, NULL, ?, ?, ?, ?, NULL, NULL, NULL, NULL, ?, NULL)
                        ''', (idc, fecha.strftime('%Y-%m-%d'), nro, premio, dist, jockey, None, None, None, nro_mandil))
                        conn.commit()
                except:
                    pass
                r += 1
            
            if not found_data:
                print("     Advertencia: No se encontraron caballos en esta carrera.")

# ---------- Resultados ----------
def parsear_resultado(ruta, conn):
    print(f"--- Procesando RESULTADO: {ruta} ---")
    try:
        df = pd.read_excel(ruta, sheet_name=0, header=None, dtype=str).fillna('')
    except Exception as e:
        print(f"Error al leer {ruta}: {e}"); return

    df_str = df.astype(str)

    fecha = None
    for _, row in df.iterrows():
        for cell in row:
            f = parsear_fecha_reunion(cell)
            if f: fecha = f; break
        if fecha: break
    if not fecha:
        f = parsear_fecha_reunion(os.path.basename(ruta))
        if not f: print("  ADVERTENCIA: sin fecha -> salto."); return
        fecha = f
    print("Fecha encontrada:", fecha.strftime('%Y-%m-%d'))

    pattern = re.compile(r'\d+[ºª]?\s*CARRERA', re.I)
    anchors = [idx for idx, row in df_str.iterrows() if any(pattern.search(str(c)) for c in row.iloc[:5])]
    
    true_anchors = []
    if anchors:
        true_anchors.append(anchors[0])
        for k in range(1, len(anchors)):
            if anchors[k] > (anchors[k-1] + 10):
                true_anchors.append(anchors[k])
    anchors = true_anchors

    if not anchors: return

    # Helper columnas resultados
    def detectar_columnas(start_idx, end_idx):
        candidatos = []
        lim = min(end_idx, start_idx+25)
        for ridx in range(start_idx, lim):
            vals = df.iloc[ridx].values
            ncols = min(len(vals), 14)
            for cp in range(0, ncols):
                p = str(vals[cp]).strip().upper()
                if not re.fullmatch(r'(\d+|U)', p): continue
                for cn in range(cp+1, ncols):
                    n = norm_txt(vals[cn])
                    if re.search(r'[A-Z]', n): candidatos.append((cp, cn))
        if not candidatos: return None, None
        mejor, score_max = None, -1
        for (cp, cn) in set(candidatos):
            s = 0
            for ridx in range(start_idx, lim):
                vals = df.iloc[ridx].values
                if cp < len(vals) and cn < len(vals):
                    p = str(vals[cp]).strip().upper()
                    n = norm_txt(vals[cn])
                    if re.fullmatch(r'(\d+|U)', p) and re.search(r'[A-Z]', n): s += 1
            if s > score_max: mejor, score_max = (cp, cn), s
        return mejor if mejor else (None, None)

    for i, start in enumerate(anchors):
        end = anchors[i+1] if i+1 < len(anchors) else len(df)
        bloque = df_str.iloc[start:end]
        texto_hdr = " ".join(" ".join(row) for row in bloque.iloc[:6].values)
        
        mc = re.search(r'(\d+)\s*(?:°|ª)?\s*CARRERA', texto_hdr, re.I)
        nro = int(mc.group(1)) if mc else (i+1)
        print(f"  Procesando Carrera N°{nro}")

        pista = _extraer_estado_pista(bloque)
        tiempo = _extraer_tiempo_limpio(bloque)
        dist_res = extraer_distancia_general(texto_hdr)
        premio_res = extraer_premio_general(texto_hdr)

        if dist_res is not None and dist_res <= 600:
            print(f"   N°{nro} | Distancia {dist_res}mts. Es cuadrera (resultado), saltando.")
            continue 

        # ... (resto logica resultados igual, extraccion de sancion etc) ...
        nota_dist = next((str(c) for _, r in bloque.iterrows() for c in r if re.search(r'distanciad', str(c), re.I)), None)
        nota_inc  = next((str(c) for _, r in bloque.iterrows() for c in r if re.search(r'tierra|rod[oó]|suelta', str(c), re.I)), None)

        col_puesto, col_nombre = detectar_columnas(start, end)
        if col_puesto is None:
            print("     No se encontró la tabla de resultados."); continue

        def es_resultado(vals):
            if col_puesto >= len(vals) or col_nombre >= len(vals): return False
            p_ok = bool(re.fullmatch(r'\s*(\d+|U)\s*', str(vals[col_puesto]).strip().upper()))
            n_ok = bool(re.search(r'[A-Z]', norm_txt(vals[col_nombre])))
            if "CARRERA" in norm_txt(vals[col_nombre]): return False
            return p_ok and n_ok

        fila_ini = None
        for ridx in range(start, end):
            if es_resultado(df.iloc[ridx].values): fila_ini = ridx; break
        if fila_ini is None: continue

        resultados = []
        puesto_counter = 1
        for ridx in range(fila_ini, end):
            vals = df.iloc[ridx].values
            if not es_resultado(vals): break
            puesto_tok = str(vals[col_puesto]).strip().upper()
            nombre = norm_txt(vals[col_nombre])
            jockey = str(vals[col_nombre+2]).strip() if (col_nombre+2)<len(vals) else None
            
            tiene_ast = '(*)' in " ".join(map(str, vals)).upper()
            resultados.append({
                'nombre': nombre, 'puesto_original': puesto_counter, 'puesto_tok': puesto_tok,
                'tiene_asterisco': tiene_ast, 'jockey': jockey
            })
            puesto_counter += 1

        # Logica sancion
        sancion_texto, nuevo_puesto_global = None, None
        if nota_dist:
            mnum = re.search(r'al\s*(\d+)', nota_dist, re.I)
            if mnum:
                nuevo_puesto_global = int(mnum.group(1))
                sancion_texto = f"Distanciado al {nuevo_puesto_global}º puesto"

        cur = conn.cursor()
        for perf in resultados:
            puesto_final = perf['puesto_original']
            obs = None
            if perf['puesto_tok'] == 'U': puesto_final, obs = 'NC', 'No corrió'
            if perf['tiene_asterisco'] and (nuevo_puesto_global or nota_inc):
                if nuevo_puesto_global: puesto_final, obs = nuevo_puesto_global, sancion_texto
                elif nota_inc: puesto_final, obs = '*', nota_inc

            # Backfill simple
            cur.execute("SELECT id_caballo FROM Caballos WHERE nombre=?", (perf['nombre'],))
            row = cur.fetchone()
            if not row:
                idc = actualizar_o_crear_caballo(conn, perf['nombre'])
                print(f"     (BACKFILL) Caballo creado desde resultado: {perf['nombre']}")
            else: idc = row[0]

            fecha_str = fecha.strftime('%Y-%m-%d')
            
            # Upsert logica simplificada para resultados
            cur.execute('''
                UPDATE Actuaciones
                SET puesto_original=?, puesto_final=?, tiempo_carrera=?, estado_pista=?,
                    observacion=COALESCE(?, observacion), jockey=COALESCE(?, jockey),
                    premio = CASE WHEN premio IS NULL THEN ? ELSE premio END,
                    distancia = COALESCE(distancia, ?)
                WHERE id_caballo=? AND fecha=? AND nro_carrera=?
            ''', (perf['puesto_original'], str(puesto_final), tiempo, pista, obs, perf['jockey'], 
                  premio_res, dist_res, idc, fecha_str, nro))
            
            if cur.rowcount == 0:
                 # Si no existia (porque el programa viejo fallo), lo creamos ahora con los datos del resultado
                 cur.execute('''
                    INSERT INTO Actuaciones(id_caballo, fecha, nro_carrera, premio, distancia, 
                                            puesto_original, puesto_final, tiempo_carrera, estado_pista, jockey, observacion)
                    VALUES(?,?,?,?,?,?,?,?,?,?,?)
                 ''', (idc, fecha_str, nro, premio_res, dist_res, perf['puesto_original'], str(puesto_final), tiempo, pista, perf['jockey'], obs))

            conn.commit()
            print(f"       > Resultado ACTUALIZADO: {perf['nombre']} -> Puesto Final {puesto_final}")

# ---------- Orquestación ----------
def procesar_archivos():
    try:
        conn = sqlite3.connect(DATABASE_FILE)
    except Exception as e:
        print("Error DB:", e); return

    print("Iniciando procesamiento de PROGRAMAS...")
    progs = get_excel_files(CARPETA_PROGRAMAS)
    progs.sort(key=get_sort_key_from_filename, reverse=True)
    for p in progs: parsear_programa(p, conn)
    print("PROGRAMAS OK.\n")

    print("Iniciando procesamiento de RESULTADOS...")
    res = get_excel_files(CARPETA_RESULTADOS)
    res.sort(key=get_sort_key_from_filename, reverse=True)
    for r in res: parsear_resultado(r, conn)
    print("RESULTADOS OK.")
    conn.close()

if __name__ == "__main__":
    crear_base_de_datos()
    procesar_archivos()
    print("\n--- SCRIPT FINALIZADO ---")