import pandas as pd
import numpy as np
import ast

from google.colab import files
uploaded = files.upload()

df = pd.read_csv('studentguard_data_prueba.csv')
df.head(15)

# Verificar tipo de datos

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

df.head(15)