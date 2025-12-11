from django.shortcuts import render

from django.http import JsonResponse

# CARGA MASIVA
def upload_csv(request):
    # TODO: implementar carga de archivo CSV
    return JsonResponse({"message": "upload_csv endpoint"}, status=200)

def clean_data(request):
    # TODO: implementar limpieza de datos
    return JsonResponse({"message": "clean_data endpoint"}, status=200)

# ENTRENAMIENTO
def train_model(request):
    # TODO: implementar entrenamiento del modelo
    return JsonResponse({"message": "train_model endpoint"}, status=200)

# EVALUACIÓN
def get_metrics(request):
    # TODO: retornar métricas del modelo
    return JsonResponse({"message": "get_metrics endpoint"}, status=200)

# AJUSTE DE HIPERPARÁMETROS
def tune_hyperparams(request):
    # TODO: recibir hiperparámetros y guardarlos
    return JsonResponse({"message": "tune_hyperparams endpoint"}, status=200)

def retrain_model(request):
    # TODO: reentrenar modelo con nuevos hiperparámetros
    return JsonResponse({"message": "retrain_model endpoint"}, status=200)

# PREDICCIÓN
def predict_risk(request):
    # TODO: usar modelo entrenado para predecir riesgo
    return JsonResponse({"message": "predict_risk endpoint"}, status=200)

def test_api(request):
    return JsonResponse({"message": "Hola desde Django API!"})
