import { useEffect, useState } from "react";
import api from "../services/api";
import { eliminarToken } from "../utils/auth";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [usuario, setUsuario] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("usuario/")  // este endpoint debe existir en el backend
      .then(res => setUsuario(res.data))
      .catch(() => {
        eliminarToken();
        navigate("/");
      });
  }, []);

  if (!usuario) return <p>Cargando...</p>;

  return (
    <div>
      <h2>Bienvenido, {usuario.usuario}</h2>
      <p>Rol: {usuario.rol}</p>
      <button onClick={() => {
        eliminarToken();
        navigate("/");
      }}>Cerrar sesión</button>
    </div>
  );
}

export default Dashboard;
