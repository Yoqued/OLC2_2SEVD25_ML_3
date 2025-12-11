import { useEffect, useState } from "react";
import { getMetrics } from "./api";

function MetricsPanel() {
  const [metrics, setMetrics] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getMetrics()
      .then(setMetrics)
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <p>Error: {error}</p>;
  if (!metrics) return <p>Cargando métricas...</p>;

  return (
    <div>
      <h2>Métricas del modelo</h2>
      <pre>{JSON.stringify(metrics, null, 2)}</pre>
    </div>
  );
}

export default MetricsPanel;
