from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
def upload_csv(request):
    # TODO: lógica real
    if request.method == "POST":
        return JsonResponse({"message": "CSV recibido (fake)"})
    return JsonResponse({"error": "Método no permitido"}, status=405)

@csrf_exempt
def clean_data(request):
    return JsonResponse({"message": "Limpieza (fake)"})

@csrf_exempt
def train_model(request):
    return JsonResponse({"message": "Entrenamiento (fake)"})

@csrf_exempt
def get_metrics(request):
    return JsonResponse({
        "accuracy": 0.95,
        "precision": 0.9,
        "recall": 0.92,
        "f1": 0.91,
    })

@csrf_exempt
def tune_hyperparams(request):
    return JsonResponse({"message": "Hiperparámetros actualizados (fake)"})

@csrf_exempt
def retrain_model(request):
    return JsonResponse({"message": "Modelo reentrenado (fake)"})

@csrf_exempt
def predict_risk(request):
    return JsonResponse({"riesgo": "alto", "probabilidad": 0.82})
