import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import api from "../services/api";

function PrivateRoute({ children, rolRequerido }) {
  const [permitido, setPermitido] = useState(null);

  useEffect(() => {
    api.get("usuario/")
      .then((res) => {
        if (res.data.rol === rolRequerido) {
          setPermitido(true);
        } else {
          setPermitido(false);
        }
      })
      .catch(() => {
        setPermitido(false);
      });
  }, [rolRequerido]);

  if (permitido === null) return <p>Cargando verificación...</p>;

  return permitido ? children : <Navigate to="/" />;
}

export default PrivateRoute;
