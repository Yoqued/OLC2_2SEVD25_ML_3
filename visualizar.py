import pandas as pd

# Leer el archivo CSV
df = pd.read_csv("archivo.csv")

# Mostrar las columnas
print("Columnas del CSV:")
print(df.columns)

print("\nInformación del DataFrame:")
df.info()

print("\nPrimeras filas del archivo:")
print(df.head())