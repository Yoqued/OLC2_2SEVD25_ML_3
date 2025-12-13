from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings

import pandas as pd
from pathlib import Path
from uuid import uuid4

from .limpieza import datas


def _ensure_dirs():
    (Path(settings.MEDIA_ROOT) / "raw").mkdir(parents=True, exist_ok=True)
    (Path(settings.MEDIA_ROOT) / "clean").mkdir(parents=True, exist_ok=True)


@csrf_exempt
def upload_csv(request):
    if request.method != "POST":
        return JsonResponse({"error": "Método no permitido"}, status=405)

    f = request.FILES.get("file")
    if not f:
        return JsonResponse({"error": "No se recibió ningún archivo en 'file'."}, status=400)

    if not f.name.lower().endswith(".csv"):
        return JsonResponse({"error": "El archivo debe ser .csv"}, status=400)

    try:
        _ensure_dirs()

        file_id = uuid4().hex
        raw_path = Path(settings.MEDIA_ROOT) / "raw" / f"{file_id}_{f.name}"

        # Guardar archivo en disco
        with open(raw_path, "wb") as out:
            for chunk in f.chunks():
                out.write(chunk)

        # Guardar la ruta en sesión (para no reenviar el archivo)
        request.session["raw_csv_path"] = str(raw_path)
        request.session.pop("clean_csv_path", None)

        return JsonResponse({
            "message": "CSV recibido y guardado correctamente",
        }, status=200)

    except Exception as e:
        return JsonResponse({"error": f"No se pudo guardar/leer el CSV: {str(e)}"}, status=400)


@csrf_exempt
def clean_data(request):
    if request.method != "POST":
        return JsonResponse({"error": "Método no permitido"}, status=405)

    raw_path = request.session.get("raw_csv_path")
    if not raw_path:
        return JsonResponse({"error": "Primero sube un CSV en /api/upload-csv/."}, status=400)

    try:
        _ensure_dirs()
        raw_path = Path(raw_path)

        #  Usa tu limpieza.py (lee el CSV internamente)
        df_clean = datas(raw_path)

        clean_path = Path(settings.MEDIA_ROOT) / "clean" / f"clean_{raw_path.name}"
        df_clean.to_csv(clean_path, index=False)

        request.session["clean_csv_path"] = str(clean_path)

        return JsonResponse({
            "message": "CSV limpiado y guardado correctamente",
        }, status=200)

    except Exception as e:
        return JsonResponse({"error": f"No se pudo limpiar el CSV: {str(e)}"}, status=400)

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
