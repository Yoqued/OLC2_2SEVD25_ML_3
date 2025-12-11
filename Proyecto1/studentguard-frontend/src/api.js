const API_URL = "http://localhost:8000/api";

export async function getMetrics() {
  const res = await fetch(`${API_URL}/metrics/`);
  if (!res.ok) {
    throw new Error("Error al obtener métricas");
  }
  return res.json();
}
