// Lista de Profesores para el Director

import React, { useEffect, useState } from "react";
import axios from "../services/api";
import { useNavigate } from 'react-router-dom';

const ListaProfesoresDirector = () => {
  const [periodos, setPeriodos] = useState([]);
  const [periodoId, setPeriodoId] = useState("");
  const [profesores, setProfesores] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/periodos/')
      .then(res => setPeriodos(res.data.periodos))
      .catch(() => setPeriodos([]));
  }, []);

  useEffect(() => {
    if (!periodoId) {
      setProfesores([]);
      return;
    }
    setLoading(true);
    axios.get(`/profesores/?periodo_id=${periodoId}`)
      .then(res => setProfesores(Array.isArray(res.data.profesores) ? res.data.profesores : []))
      .catch(() => setProfesores([]))
      .finally(() => setLoading(false));
  }, [periodoId]);

  const imprimir = () => window.print();
  const volver = () => navigate('/director');

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-primary">Lista de Profesores</h2>
      </div>

      <select
        className="form-select mb-3"
        style={{ width: 400 }}
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

      {!loading && Array.isArray(profesores) && profesores.length > 0 && (
        <table className="table table-bordered">
          <thead className="table-light">
            <tr>
              <th>Nombre del Profesor</th>
              <th>Curso</th>
              <th>Periodo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {profesores.map((profesor) => (
              <tr key={profesor.id}>
                <td>{profesor.nombre}</td>
                <td>{profesor.curso}</td>
                <td>{profesor.periodo}</td>
                <td>
                  <button className="btn btn-primary btn-sm me-2">
                    Ver Detalles
                  </button>
                  <button className="btn btn-danger btn-sm">
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {!loading && Array.isArray(profesores) && profesores.length === 0 && periodoId && (
        <div>No hay profesores para este periodo.</div>
      )}

      <div className="text-center mt-4">
        <button className="btn btn-outline-secondary me-3" onClick={() => window.print()}>
          Imprimir / Guardar PDF
        </button>
        <button onClick={volver} className="btn btn-secondary">Volver</button>
      </div>

    </div>
  );
};

export default ListaProfesoresDirector;
