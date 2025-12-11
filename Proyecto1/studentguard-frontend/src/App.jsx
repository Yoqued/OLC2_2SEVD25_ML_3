import { useEffect, useState } from "react";

function App() {
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("http://localhost:8000/api/test/")
      .then((res) => res.json())
      .then((data) => setMsg(data.message))
      .catch((err) => console.error("Error:", err));
  }, []);

  return (
    <div style={{ padding: "20px", fontSize: "22px" }}>
      <h1>React + Django Test</h1>
      <p>Respuesta del backend: {msg}</p>
    </div>
  );
}

export default App;

