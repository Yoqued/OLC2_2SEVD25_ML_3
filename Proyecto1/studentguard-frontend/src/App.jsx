import { useState } from "react";
import {
  uploadCsv,
  cleanData,
  trainModel,
  getMetrics,
  tuneHyperparams,
  retrainModel,
  predictRisk,
} from "./api";

function App() {
  const [activeTab, setActiveTab] = useState("upload");
  const [globalMessage, setGlobalMessage] = useState("");

  const handleSetTab = (tab) => {
    setGlobalMessage("");
    setActiveTab(tab);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        fontFamily: "system-ui, sans-serif",
        backgroundColor: "#0f172a",
        color: "#e5e7eb",
      }}
    >
      <header
        style={{
          padding: "12px 24px",
          borderBottom: "1px solid #1e293b",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#020617",
        }}
      >
        <h1 style={{ fontSize: "20px", fontWeight: "600" }}>StudentGuard</h1>
        <span style={{ fontSize: "14px", color: "#9ca3af" }}>
          Panel de administración del modelo
        </span>
      </header>

      <div style={{ display: "flex", flex: 1 }}>
        {/* Sidebar */}
        <nav
          style={{
            width: "240px",
            borderRight: "1px solid #1e293b",
            padding: "16px 12px",
            backgroundColor: "#020617",
          }}
        >
          <NavButton
            active={activeTab === "upload"}
            onClick={() => handleSetTab("upload")}
          >
            1. Carga masiva
          </NavButton>
          <NavButton
            active={activeTab === "train"}
            onClick={() => handleSetTab("train")}
          >
            2. Entrenamiento
          </NavButton>
          <NavButton
            active={activeTab === "metrics"}
            onClick={() => handleSetTab("metrics")}
          >
            3. Métricas
          </NavButton>
          <NavButton
            active={activeTab === "hyper"}
            onClick={() => handleSetTab("hyper")}
          >
            4. Hiperparámetros
          </NavButton>
          <NavButton
            active={activeTab === "predict"}
            onClick={() => handleSetTab("predict")}
          >
            5. Predicción
          </NavButton>
        </nav>

        {/* Contenido principal */}
        <main style={{ flex: 1, padding: "24px" }}>
          {globalMessage && (
            <div
              style={{
                marginBottom: "16px",
                padding: "10px 12px",
                borderRadius: "6px",
                backgroundColor: "#022c22",
                border: "1px solid #047857",
                fontSize: "14px",
              }}
            >
              {globalMessage}
            </div>
          )}

          {activeTab === "upload" && (
            <UploadCsvSection setGlobalMessage={setGlobalMessage} />
          )}
          {activeTab === "train" && (
            <TrainSection setGlobalMessage={setGlobalMessage} />
          )}
          {activeTab === "metrics" && <MetricsSection />}
          {activeTab === "hyper" && (
            <HyperparamsSection setGlobalMessage={setGlobalMessage} />
          )}
          {activeTab === "predict" && <PredictSection />}
        </main>
      </div>
    </div>
  );
}

// ---------------- COMPONENTES AUXILIARES ----------------

function NavButton({ active, children, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: "100%",
        textAlign: "left",
        padding: "10px 12px",
        marginBottom: "6px",
        borderRadius: "6px",
        border: "none",
        cursor: "pointer",
        fontSize: "14px",
        backgroundColor: active ? "#1d4ed8" : "transparent",
        color: active ? "#e5e7eb" : "#9ca3af",
      }}
    >
      {children}
    </button>
  );
}

// 1. CARGA MASIVA
function UploadCsvSection({ setGlobalMessage }) {
  const [file, setFile] = useState(null);
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [loadingClean, setLoadingClean] = useState(false);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setGlobalMessage("Selecciona un archivo CSV primero.");
      return;
    }
    try {
      setLoadingUpload(true);
      const res = await uploadCsv(file);
      setGlobalMessage(res.message || "CSV subido correctamente.");
    } catch (err) {
      setGlobalMessage(err.message);
    } finally {
      setLoadingUpload(false);
    }
  };

  const handleClean = async () => {
    try {
      setLoadingClean(true);
      const res = await cleanData();
      setGlobalMessage(res.message || "Limpieza de datos completada.");
    } catch (err) {
      setGlobalMessage(err.message);
    } finally {
      setLoadingClean(false);
    }
  };

  return (
    <section>
      <h2 style={{ fontSize: "18px", marginBottom: "12px" }}>Carga masiva</h2>
      <p style={{ fontSize: "14px", color: "#9ca3af", marginBottom: "16px" }}>
        Sube un archivo CSV con los datos de los estudiantes para que el sistema
        pueda entrenar el modelo.
      </p>

      <form
        onSubmit={handleUpload}
        style={{
          padding: "16px",
          borderRadius: "8px",
          border: "1px solid #1f2937",
          backgroundColor: "#020617",
          marginBottom: "16px",
        }}
      >
        <label style={{ fontSize: "14px", marginBottom: "8px", display: "block" }}>
          Archivo CSV:
        </label>
        <input
          type="file"
          accept=".csv"
          onChange={(e) => setFile(e.target.files[0] || null)}
          style={{
            marginBottom: "12px",
            fontSize: "14px",
          }}
        />
        <br />
        <button
          type="submit"
          disabled={loadingUpload}
          style={{
            padding: "8px 12px",
            fontSize: "14px",
            borderRadius: "6px",
            border: "none",
            cursor: "pointer",
            backgroundColor: "#1d4ed8",
            color: "#e5e7eb",
          }}
        >
          {loadingUpload ? "Subiendo..." : "Subir CSV"}
        </button>
      </form>

      <div
        style={{
          padding: "16px",
          borderRadius: "8px",
          border: "1px solid #1f2937",
          backgroundColor: "#020617",
        }}
      >
        <h3 style={{ fontSize: "16px", marginBottom: "8px" }}>Limpieza de datos</h3>
        <p style={{ fontSize: "14px", color: "#9ca3af", marginBottom: "12px" }}>
          Ejecuta el proceso de limpieza para manejar valores nulos, duplicados y
          estandarizaciones antes del entrenamiento.
        </p>
        <button
          onClick={handleClean}
          disabled={loadingClean}
          style={{
            padding: "8px 12px",
            fontSize: "14px",
            borderRadius: "6px",
            border: "none",
            cursor: "pointer",
            backgroundColor: "#10b981",
            color: "#022c22",
          }}
        >
          {loadingClean ? "Limpiando..." : "Limpiar datos"}
        </button>
      </div>
    </section>
  );
}

// 2. ENTRENAMIENTO
function TrainSection({ setGlobalMessage }) {
  const [loading, setLoading] = useState(false);

  const handleTrain = async () => {
    try {
      setLoading(true);
      const res = await trainModel();
      setGlobalMessage(res.message || "Modelo entrenado correctamente.");
    } catch (err) {
      setGlobalMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <h2 style={{ fontSize: "18px", marginBottom: "12px" }}>Entrenamiento</h2>
      <p style={{ fontSize: "14px", color: "#9ca3af", marginBottom: "16px" }}>
        Entrena el modelo de StudentGuard con los datos ya preprocesados.
      </p>
      <button
        onClick={handleTrain}
        disabled={loading}
        style={{
          padding: "10px 14px",
          fontSize: "14px",
          borderRadius: "6px",
          border: "none",
          cursor: "pointer",
          backgroundColor: "#1d4ed8",
          color: "#e5e7eb",
        }}
      >
        {loading ? "Entrenando..." : "Entrenar modelo"}
      </button>
    </section>
  );
}

// 3. MÉTRICAS
function MetricsSection() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLoadMetrics = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getMetrics();
      setMetrics(res);
    } catch (err) {
      setError(err.message);
      setMetrics(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <h2 style={{ fontSize: "18px", marginBottom: "12px" }}>Métricas del modelo</h2>
      <p style={{ fontSize: "14px", color: "#9ca3af", marginBottom: "16px" }}>
        Visualiza el rendimiento actual del modelo (exactitud, precisión, recall, F1,
        etc.).
      </p>

      <button
        onClick={handleLoadMetrics}
        disabled={loading}
        style={{
          padding: "8px 12px",
          fontSize: "14px",
          borderRadius: "6px",
          border: "none",
          cursor: "pointer",
          backgroundColor: "#1d4ed8",
          color: "#e5e7eb",
          marginBottom: "16px",
        }}
      >
        {loading ? "Cargando..." : "Actualizar métricas"}
      </button>

      {error && (
        <div
          style={{
            marginBottom: "12px",
            padding: "10px",
            borderRadius: "6px",
            backgroundColor: "#450a0a",
            border: "1px solid #b91c1c",
            fontSize: "14px",
          }}
        >
          {error}
        </div>
      )}

      {metrics && (
        <pre
          style={{
            backgroundColor: "#020617",
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #1f2937",
            fontSize: "13px",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}
        >
          {JSON.stringify(metrics, null, 2)}
        </pre>
      )}
    </section>
  );
}

// 4. HIPERPARÁMETROS
function HyperparamsSection({ setGlobalMessage }) {
  const [learningRate, setLearningRate] = useState("0.1");
  const [nEstimators, setNEstimators] = useState("100");
  const [maxDepth, setMaxDepth] = useState("5");
  const [loadingTune, setLoadingTune] = useState(false);
  const [loadingRetrain, setLoadingRetrain] = useState(false);

  const handleSaveParams = async (e) => {
    e.preventDefault();
    try {
      setLoadingTune(true);
      const params = {
        learning_rate: parseFloat(learningRate),
        n_estimators: parseInt(nEstimators),
        max_depth: parseInt(maxDepth),
      };
      const res = await tuneHyperparams(params);
      setGlobalMessage(res.message || "Hiperparámetros actualizados.");
    } catch (err) {
      setGlobalMessage(err.message);
    } finally {
      setLoadingTune(false);
    }
  };

  const handleRetrain = async () => {
    try {
      setLoadingRetrain(true);
      const res = await retrainModel();
      setGlobalMessage(res.message || "Modelo reentrenado con nuevos parámetros.");
    } catch (err) {
      setGlobalMessage(err.message);
    } finally {
      setLoadingRetrain(false);
    }
  };

  return (
    <section>
      <h2 style={{ fontSize: "18px", marginBottom: "12px" }}>Ajuste de hiperparámetros</h2>
      <p style={{ fontSize: "14px", color: "#9ca3af", marginBottom: "16px" }}>
        Ajusta los hiperparámetros del modelo y vuelve a entrenar para mejorar el
        rendimiento.
      </p>

      <form
        onSubmit={handleSaveParams}
        style={{
          padding: "16px",
          borderRadius: "8px",
          border: "1px solid #1f2937",
          backgroundColor: "#020617",
          marginBottom: "16px",
          maxWidth: "400px",
        }}
      >
        <div style={{ marginBottom: "10px" }}>
          <label style={{ display: "block", fontSize: "14px", marginBottom: "4px" }}>
            Learning rate:
          </label>
          <input
            type="number"
            step="0.01"
            value={learningRate}
            onChange={(e) => setLearningRate(e.target.value)}
            style={{
              width: "100%",
              padding: "6px 8px",
              borderRadius: "4px",
              border: "1px solid #374151",
              backgroundColor: "#020617",
              color: "#e5e7eb",
              fontSize: "14px",
            }}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label style={{ display: "block", fontSize: "14px", marginBottom: "4px" }}>
            Número de estimadores:
          </label>
          <input
            type="number"
            value={nEstimators}
            onChange={(e) => setNEstimators(e.target.value)}
            style={{
              width: "100%",
              padding: "6px 8px",
              borderRadius: "4px",
              border: "1px solid #374151",
              backgroundColor: "#020617",
              color: "#e5e7eb",
              fontSize: "14px",
            }}
          />
        </div>

        <div style={{ marginBottom: "12px" }}>
          <label style={{ display: "block", fontSize: "14px", marginBottom: "4px" }}>
            Profundidad máxima:
          </label>
          <input
            type="number"
            value={maxDepth}
            onChange={(e) => setMaxDepth(e.target.value)}
            style={{
              width: "100%",
              padding: "6px 8px",
              borderRadius: "4px",
              border: "1px solid #374151",
              backgroundColor: "#020617",
              color: "#e5e7eb",
              fontSize: "14px",
            }}
          />
        </div>

        <button
          type="submit"
          disabled={loadingTune}
          style={{
            padding: "8px 12px",
            fontSize: "14px",
            borderRadius: "6px",
            border: "none",
            cursor: "pointer",
            backgroundColor: "#1d4ed8",
            color: "#e5e7eb",
            marginRight: "8px",
          }}
        >
          {loadingTune ? "Guardando..." : "Guardar parámetros"}
        </button>
      </form>

      <button
        onClick={handleRetrain}
        disabled={loadingRetrain}
        style={{
          padding: "8px 12px",
          fontSize: "14px",
          borderRadius: "6px",
          border: "none",
          cursor: "pointer",
          backgroundColor: "#10b981",
          color: "#022c22",
        }}
      >
        {loadingRetrain ? "Reentrenando..." : "Reentrenar modelo"}
      </button>
    </section>
  );
}

// 5. PREDICCIÓN
function PredictSection() {
  const [form, setForm] = useState({
    promedio_actual: "",
    asistencia_clases: "",
    tareas_entregadas: "",
    participacion_clase: "",
    horas_estudio: "",
    promedio_evaluaciones: "",
    cursos_reprobados: "",
    actividades_extracurriculares: "",
    reportes_disciplinarios: "",
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePredict = async (e) => {
    e.preventDefault();
    setError("");
    setResult(null);

    // Aquí puedes hacer validaciones básicas si quieres
    try {
      setLoading(true);
      const payload = {
        ...form,
        promedio_actual: parseFloat(form.promedio_actual),
        asistencia_clases: parseFloat(form.asistencia_clases),
        tareas_entregadas: parseFloat(form.tareas_entregadas),
        participacion_clase: parseFloat(form.participacion_clase),
        horas_estudio: parseFloat(form.horas_estudio),
        promedio_evaluaciones: parseFloat(form.promedio_evaluaciones),
        cursos_reprobados: parseInt(form.cursos_reprobados),
        actividades_extracurriculares: form.actividades_extracurriculares,
        reportes_disciplinarios: parseInt(form.reportes_disciplinarios),
      };
      const res = await predictRisk(payload);
      setResult(res);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <h2 style={{ fontSize: "18px", marginBottom: "12px" }}>Predicción individual</h2>
      <p style={{ fontSize: "14px", color: "#9ca3af", marginBottom: "16px" }}>
        Ingresa los datos de un estudiante para estimar si se encuentra en riesgo de
        deserción.
      </p>

      <form
        onSubmit={handlePredict}
        style={{
          padding: "16px",
          borderRadius: "8px",
          border: "1px solid #1f2937",
          backgroundColor: "#020617",
          maxWidth: "500px",
        }}
      >
        <FormRow
          label="Promedio actual"
          name="promedio_actual"
          value={form.promedio_actual}
          onChange={handleChange}
        />
        <FormRow
          label="Asistencia a clases (%)"
          name="asistencia_clases"
          value={form.asistencia_clases}
          onChange={handleChange}
        />
        <FormRow
          label="Tareas entregadas (%)"
          name="tareas_entregadas"
          value={form.tareas_entregadas}
          onChange={handleChange}
        />
        <FormRow
          label="Participación en clase (%)"
          name="participacion_clase"
          value={form.participacion_clase}
          onChange={handleChange}
        />
        <FormRow
          label="Horas de estudio por semana"
          name="horas_estudio"
          value={form.horas_estudio}
          onChange={handleChange}
        />
        <FormRow
          label="Promedio en evaluaciones parciales"
          name="promedio_evaluaciones"
          value={form.promedio_evaluaciones}
          onChange={handleChange}
        />
        <FormRow
          label="Cursos reprobados/retirados"
          name="cursos_reprobados"
          value={form.cursos_reprobados}
          onChange={handleChange}
        />
        <FormRow
          label="Actividades extracurriculares (texto)"
          name="actividades_extracurriculares"
          value={form.actividades_extracurriculares}
          onChange={handleChange}
        />
        <FormRow
          label="Reportes disciplinarios"
          name="reportes_disciplinarios"
          value={form.reportes_disciplinarios}
          onChange={handleChange}
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            marginTop: "8px",
            padding: "8px 12px",
            fontSize: "14px",
            borderRadius: "6px",
            border: "none",
            cursor: "pointer",
            backgroundColor: "#1d4ed8",
            color: "#e5e7eb",
          }}
        >
          {loading ? "Calculando..." : "Predecir riesgo"}
        </button>
      </form>

      {error && (
        <div
          style={{
            marginTop: "12px",
            padding: "10px",
            borderRadius: "6px",
            backgroundColor: "#450a0a",
            border: "1px solid #b91c1c",
            fontSize: "14px",
          }}
        >
          {error}
        </div>
      )}

      {result && (
        <div
          style={{
            marginTop: "16px",
            padding: "16px",
            borderRadius: "8px",
            border: "1px solid #1f2937",
            backgroundColor: "#020617",
          }}
        >
          <h3 style={{ fontSize: "16px", marginBottom: "8px" }}>
            Resultado de la predicción
          </h3>
          <pre
            style={{
              fontSize: "13px",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
            }}
          >
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </section>
  );
}

function FormRow({ label, name, value, onChange }) {
  return (
    <div style={{ marginBottom: "10px" }}>
      <label
        htmlFor={name}
        style={{ display: "block", fontSize: "14px", marginBottom: "4px" }}
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        style={{
          width: "100%",
          padding: "6px 8px",
          borderRadius: "4px",
          border: "1px solid #374151",
          backgroundColor: "#020617",
          color: "#e5e7eb",
          fontSize: "14px",
        }}
      />
    </div>
  );
}

export default App;
