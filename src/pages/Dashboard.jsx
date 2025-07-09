// Dahsboard Principal que redirige según el rol del usuario

import { useEffect, useState } from "react";
import api from "../services/api";
import { eliminarToken } from "../utils/auth";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [usuario, setUsuario] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("usuario/")
      .then(res => {
        setUsuario(res.data);

        // Redirige según el rol
        const rol = res.data.rol;
        if (rol === "director") navigate("/director");
        else if (rol === "profesor") navigate("/profesor");
        else if (rol === "alumno") navigate("/alumno");
        else navigate("/");
      })
      .catch(() => {
        eliminarToken();
        navigate("/");
      });
  }, []);

  return <p>Cargando...</p>;
}

export default Dashboard;
