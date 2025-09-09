// pages/ListaCursosDirector.jsx

import React, { useEffect, useState } from "react";
import axios from "../services/api";
import { useNavigate } from "react-router-dom";

const ListaCursosDirector = () => {
  const [periodos, setPeriodos] = useState([]);
  const [periodoId, setPeriodoId] = useState("");
  const [cursos, setCursos] = useState([]);
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();
  const volver = () => navigate('/director');
  

  useEffect(() => {
    axios.get('/director/periodos/')
      .then(res => setPeriodos(res.data.periodos))
      .catch(() => setPeriodos([]));
  }, []);

  useEffect(() => {
    if (periodoId) {
      setCargando(true);
      axios.get(`/director/dashboard/?periodo_id=${periodoId}`)
        .then(res => {
          // Ordenar cursos por nivel (asumiendo que nivel es un string como 'Nivel 1', 'Nivel 2', ...)
          const cursosOrdenados = [...res.data.dashboard].sort((a, b) => {
            const nA = parseInt((a.nivel || '').replace(/\D/g, '')) || 0;
            const nB = parseInt((b.nivel || '').replace(/\D/g, '')) || 0;
            return nA - nB;
          });
          setCursos(cursosOrdenados);
        })
        .catch(() => setCursos([]))
        .finally(() => setCargando(false));
    } else {
      setCursos([]);
    }
  }, [periodoId]);

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-primary">Lista de Cursos</h2>
      </div>

      <select
        className="form-select mb-3"
        style={{ width: 400 }}
        value={periodoId}
        onChange={(e) => setPeriodoId(e.target.value)}
      >
        <option value="">Seleccione un periodo académico</option>
        {periodos.map(p => (
          <option key={p.id} value={p.id}>{p.nombre}</option>
        ))}
      </select>

      {cargando && <div>Cargando cursos...</div>}

      {!cargando && cursos.length > 0 && (
        <table className="table table-bordered">
          <thead className="table-light">
            <tr>
              <th>Nivel</th>
              <th>Curso</th>
              <th>Horario</th>
              <th>Maestro Titular</th>
              <th>Maestro Asistente</th>
              <th>Alumnos</th>
              <th>% Asistencia</th>
              <th>% Aprobados</th>
            </tr>
          </thead>
          <tbody>
            {cursos.map((clase, i) => (
              <tr key={i}>
                <td>{clase.nivel}</td>
                <td>{clase.curso}</td>
                <td>{clase.horarios?.map((h, i) => <div key={i}>{h}</div>)}</td>
                <td>{clase.maestro_titular?.nombre_completo || "—"}</td>
                <td>{clase.maestro_asistente?.nombre_completo || "—"}</td>
                <td>{clase.total_alumnos}</td>

                {/* Asistencia */}
                <td>
                    <div className="progress" style={{ height: '20px' }}>
                        <div
                        className={`progress-bar ${
                            clase.asistencia_promedio <= 30
                            ? 'bg-danger'
                            : clase.asistencia_promedio <= 70
                            ? 'bg-warning text-dark'
                            : 'bg-success'
                        }`}
                        role="progressbar"
                        style={{ width: `${clase.asistencia_promedio}%` }}
                        >
                        {clase.asistencia_promedio}%
                        </div>
                    </div>
                </td>

                {/* Aprobados */}
                <td>
                    <div className="progress" style={{ height: '20px' }}>
                        <div
                        className={`progress-bar ${
                            clase.porcentaje_aprobados < 50
                            ? 'bg-danger'
                            : clase.porcentaje_aprobados < 80
                            ? 'bg-warning text-dark'
                            : 'bg-success'
                        }`}
                        role="progressbar"
                        style={{ width: `${clase.porcentaje_aprobados}%` }}
                        >
                        {clase.porcentaje_aprobados}%
                        </div>
                    </div>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      )}

      {!cargando && periodoId && cursos.length === 0 && (
        <div>No hay cursos para este periodo.</div>
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

export default ListaCursosDirector;
