// Lista de Profesores para el Director

import React, { useEffect, useState } from "react";
import { getPeriodosAcademicos, getProfesoresPorPeriodo } from "../services/api";
import { useNavigate } from 'react-router-dom';

const obtenerOrdenSemestre = (nombre = '') => {
  const semestre = nombre.match(/\b(III|II|I)\b/i)?.[1]?.toUpperCase();
  return { I: 1, II: 2, III: 3 }[semestre] || 0;
};

const ListaProfesoresDirector = () => {
  const [periodos, setPeriodos] = useState([]);
  const [periodoId, setPeriodoId] = useState("");
  const [profesores, setProfesores] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getPeriodosAcademicos()
      .then(data => {
        const periodosOrdenados = Array.isArray(data) ? [...data].sort((a, b) => {
          const ordenAnio = Number(b.anio || 0) - Number(a.anio || 0);
          if (ordenAnio !== 0) return ordenAnio;

          const ordenSemestre = obtenerOrdenSemestre(b.nombre) - obtenerOrdenSemestre(a.nombre);
          if (ordenSemestre !== 0) return ordenSemestre;

          return String(b.fecha_inicio || '').localeCompare(String(a.fecha_inicio || ''));
        }) : [];
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
              <th>N°</th>
              <th>Nombre</th>
              <th>Cursos</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>Dirección</th>
            </tr>
          </thead>
          <tbody>
            {profesores.map((profesor, index) => (
              <tr key={profesor.id}>
                <td>{index + 1}</td>
                <td>{profesor.nombre_completo}</td>
                <td>
                  {profesor.cursos && profesor.cursos.length > 0
                    ? profesor.cursos[0]
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
