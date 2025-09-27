// Lista de Profesores para el Director

import React, { useEffect, useState } from "react";
import { getPeriodosAcademicos, getProfesoresPorPeriodo } from "../services/api";
import { useNavigate } from 'react-router-dom';

const ListaProfesoresDirector = () => {
  const [periodos, setPeriodos] = useState([]);
  const [periodoId, setPeriodoId] = useState("");
  const [profesores, setProfesores] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getPeriodosAcademicos()
      .then(data => {
        console.log("Periodos recibidos:", data); // <-- Agrega este log
        // Ordenar periodos de A a Z por nombre
        const periodosOrdenados = Array.isArray(data) ? 
          data.sort((a, b) => (a.nombre || '').localeCompare(b.nombre || '', 'es', { sensitivity: 'base' })) : 
          [];
        setPeriodos(periodosOrdenados);
      })
      .catch(() => setPeriodos([]));
  }, []);

  useEffect(() => {
    if (periodoId) {
      setLoading(true);
      getProfesoresPorPeriodo(periodoId)
        .then((data) => {
          // Si la respuesta es un objeto con array, tomar el array
          let profesoresList = [];
          if (Array.isArray(data)) {
            profesoresList = data;
          } else if (Array.isArray(data?.profesores)) {
            profesoresList = data.profesores;
          }
          
          // Ordenar profesores de A a Z por nombre completo
          const profesoresOrdenados = profesoresList.sort((a, b) => 
            (a.nombre_completo || '').localeCompare(b.nombre_completo || '', 'es', { sensitivity: 'base' })
          );
          
          setProfesores(profesoresOrdenados);
        })
        .catch(() => setProfesores([]))
        .finally(() => setLoading(false));
    } else {
      setProfesores([]);
    }
  }, [periodoId]);

  const imprimir = () => window.print();
  const navigate = useNavigate();
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
        {(Array.isArray(periodos) ? periodos : []).map(p => (
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
              <th>Nombre</th>
              <th>Cursos</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>Dirección</th>
            </tr>
          </thead>
          <tbody>
            {profesores.map((profesor) => (
              <tr key={profesor.id}>
                <td>{profesor.nombre_completo}</td>
                <td>
                  {profesor.cursos && profesor.cursos.length > 0
                    ? profesor.cursos.join(", ")
                    : "Sin clases"}
                </td>
                <td>{profesor.email}</td>
                <td>{profesor.telefono}</td>
                <td>{profesor.direccion}</td>
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
