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