import pandas as pd
import numpy as np
import ast

def datas(uploaded_file):
    print("Iniciando limpieza de datos...")
    df = pd.read_csv(uploaded_file)

    # Columnas numéricas continuas (porcentajes / promedios)
    cols_porcentajes = [
        'promedio_actual',
        'asistencia_clases',
        'tareas_entregadas',
        'participacion_clase',
        'promedio_evaluaciones'
    ]

    # Columnas numéricas enteras
    cols_enteras = [
        'horas_estudio',
        'cursos_reprobados',
        'reportes_disciplinarios'
    ]

    for col in cols_porcentajes + cols_enteras:
        df[col] = pd.to_numeric(df[col], errors='coerce')


    # Columnas que representan porcentajes
    for col in cols_porcentajes:

        # Marcaremons como NaN los valores fuera de rango [0, 100]
        fuera_rango = ~df[col].between(0, 100)
        df.loc[fuera_rango, col] = np.nan

        # Calcular mediana solo con los valores válidos
        mediana_valida = df[col].median()

        # Rellenar faltantes
        df[col] = df[col].fillna(mediana_valida)



    # Columnas que representan números enteros

    # horas_estudio
    df.loc[df['horas_estudio'] < 0, 'horas_estudio'] = np.nan

    df['horas_estudio'] = df['horas_estudio'].fillna(0).astype(int)


    # cursos_reprobados

    # Marcar valores negativos como NaN
    df.loc[df['cursos_reprobados'] < 0, 'cursos_reprobados'] = np.nan

    # Llenar faltantes con 0
    df['cursos_reprobados'] = df['cursos_reprobados'].fillna(0).astype(int)



    # actividades_extracurriculares

    # Convertir valores vacíos o NaN a lista vacía
    df['actividades_extracurriculares'] = df['actividades_extracurriculares'].replace(
        ["", "[]", None],
        pd.NA
    )

    # Recorrer fila por fila y corregir
    for i in range(len(df)):
        value = df.at[i, 'actividades_extracurriculares']

        # Caso 1: valor vacío o NaN → []
        if pd.isna(value):
            df.at[i, 'actividades_extracurriculares'] = []
            continue

        # Caso 2: intentar convertir desde string
        try:
            parsed = ast.literal_eval(str(value))

            # Si el resultado es lista → dejarla
            if isinstance(parsed, list):
                df.at[i, 'actividades_extracurriculares'] = parsed
            else:
                df.at[i, 'actividades_extracurriculares'] = []

        except:
            # Caso 3: cualquier error → []
            df.at[i, 'actividades_extracurriculares'] = []


    # reportes_disciplinarios
    # Marcar valores negativos como NaN
    df.loc[df['reportes_disciplinarios'] < 0, 'reportes_disciplinarios'] = np.nan

    # Llenar faltantes con 0
    df['reportes_disciplinarios'] = df['reportes_disciplinarios'].fillna(0).astype(int)


    # Columna de riesgo
    df['riesgo'] = df['riesgo'].astype(str).str.strip().str.lower()

    # Filtrar valores válidos
    df = df[df['riesgo'].isin(['riesgo', 'no riesgo'])].copy()

    # Reemplazar directamente riesgo por 0/1
    df['riesgo'] = df['riesgo'].map({'no riesgo': 0, 'riesgo': 1})


    # Eliminar duplicados

    df['actividades_extracurriculares'] = df['actividades_extracurriculares'].apply(tuple)

    df = df.drop_duplicates().reset_index(drop=True)

    df['actividades_extracurriculares'] = df['actividades_extracurriculares'].apply(list)


    # Columna extra para representar número de actividades
    df['num_actividades'] = df['actividades_extracurriculares'].apply(
        lambda x: len(x) if isinstance(x, list) else 0
    )

    print("Limpieza de datos completada.--------------------------------------")

    return df