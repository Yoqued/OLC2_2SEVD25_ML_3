const API_URL = "http://localhost:8000/api";

// ---------- CARGA MASIVA ----------

export async function uploadCsv(file) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_URL}/upload-csv/`, {
    method: "POST",
    body: formData,
    credentials: "include", 
  });

  if (!res.ok) throw new Error("Error al subir el CSV");
  return res.json();
}


export async function cleanData() {
  const res = await fetch(`${API_URL}/clean-data/`, {
    method: "POST",
    credentials: "include",
  });

  if (!res.ok) throw new Error("Error al limpiar datos");
  return res.json();
}


// ---------- ENTRENAMIENTO ----------

export async function trainModel() {
  const res = await fetch(`${API_URL}/train-model/`, {
    method: "POST",
  });

  if (!res.ok) {
    throw new Error("Error al entrenar el modelo");
  }

  return res.json();
}

// ---------- MÉTRICAS ----------

export async function getMetrics() {
  const res = await fetch(`${API_URL}/metrics/`);

  if (!res.ok) {
    throw new Error("Error al obtener métricas");
  }

  return res.json();
}

// ---------- HIPERPARÁMETROS ----------

export async function tuneHyperparams(params) {
  const res = await fetch(`${API_URL}/tune-hyperparams/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    throw new Error("Error al ajustar hiperparámetros");
  }

  return res.json();
}

export async function retrainModel() {
  const res = await fetch(`${API_URL}/retrain/`, {
    method: "POST",
  });

  if (!res.ok) {
    throw new Error("Error al reentrenar el modelo");
  }

  return res.json();
}

// ---------- PREDICCIÓN ----------

export async function predictRisk(payload) {
  const res = await fetch(`${API_URL}/predict/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error("Error al predecir riesgo");
  }

  return res.json();
}
