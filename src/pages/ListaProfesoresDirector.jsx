import React, { useEffect, useState } from "react";
import { getPeriodosAcademicos, getProfesoresPorPeriodo } from "../services/api";

const ListaProfesoresDirector = () => {
  const [periodos, setPeriodos] = useState([]);
  const [periodoId, setPeriodoId] = useState("");
  const [profesores, setProfesores] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getPeriodosAcademicos().then(setPeriodos);
  }, []);

  useEffect(() => {
    if (periodoId) {
      setLoading(true);
      getProfesoresPorPeriodo(periodoId)
        .then(setProfesores)
        .finally(() => setLoading(false));
    } else {
      setProfesores([]);
    }
  }, [periodoId]);

  return (
    <div>
      <h2>Lista de Profesores por Periodo Académico</h2>
      <select
        className="form-select mb-3"
        value={periodoId}
        onChange={e => setPeriodoId(e.target.value)}
      >
        <option value="">Seleccione un periodo académico</option>
        {periodos.map(p => (
          <option key={p.id} value={p.id}>
            {p.nombre}
          </option>
        ))}
      </select>

      {loading && <div>Cargando...</div>}

      {!loading && profesores.length > 0 && (
        <table className="table">
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>Dirección</th>
            </tr>
          </thead>
          <tbody>
            {profesores.map(p => (
              <tr key={p.id}>
                <td>{p.username}</td>
                <td>{p.nombre_completo}</td>
                <td>{p.email}</td>
                <td>{p.telefono}</td>
                <td>{p.direccion}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ListaProfesoresDirector;