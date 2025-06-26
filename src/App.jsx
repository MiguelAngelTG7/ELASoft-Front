import { useEffect, useState } from "react";
import api from "./services/api";

function App() {
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    api.get("/")
      .then(res => setMensaje(res.data.mensaje))
      .catch(err => setMensaje("Error conectando al backend"));
  }, []);

  return (
    <div>
      <h1>React + Django (Elasoft)</h1>
      <p>Respuesta del backend: {mensaje}</p>
    </div>
  );
}

export default App;
